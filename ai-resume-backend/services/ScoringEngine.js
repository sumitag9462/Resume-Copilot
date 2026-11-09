// services/ScoringEngine.js — EVALUATION & RANKING ENGINE
//
// Calculates metrics (grammar, readability, keywords, ATS compatibility, etc.)
// from model outputs and ranks models to select category winners.

/**
 * Calculates quality scores for a model's parsed JSON output.
 * 
 * @param {string} feature The feature key (e.g. 'ats_analysis')
 * @param {object} output The parsed JSON output from the Gemini model
 * @param {number} executionTime The execution time in ms
 * @returns {object} The scores object
 */
const scoreOutput = (feature, output, executionTime) => {
  if (!output || typeof output !== "object") {
    return {
      grammar: 0,
      readability: 0,
      keywordDensity: 0,
      ats: 0,
      professionalism: 0,
      completeness: 0,
      practicality: 0,
      overall: 0,
      modelReportedScore: null
    };
  }

  // 1. Grammar Score
  let grammar = 100;
  if (Array.isArray(output.grammarIssues)) {
    grammar = Math.max(20, 100 - (output.grammarIssues.length * 15));
  } else if (typeof output.grammarScore === "number") {
    grammar = Math.min(100, Math.max(0, output.grammarScore));
  }

  // 2. Readability Score
  let readability = null;
  if (typeof output.readabilityScore === "number") {
    readability = Math.min(100, Math.max(0, output.readabilityScore));
  } else if (typeof output.readability === "number") {
    readability = Math.min(100, Math.max(0, output.readability));
  }

  // 3. Keyword Density / Match
  let keywordDensity = null;
  if (typeof output.keywordCoverage === "number") {
    keywordDensity = Math.min(100, Math.max(0, output.keywordCoverage));
  } else if (typeof output.matchScore === "number") {
    keywordDensity = Math.min(100, Math.max(0, output.matchScore));
  } else if (Array.isArray(output.matchedSkills) && Array.isArray(output.missingSkills)) {
    const total = output.matchedSkills.length + output.missingSkills.length;
    keywordDensity = total > 0 ? Math.round((output.matchedSkills.length / total) * 100) : 50;
  } else if (Array.isArray(output.missingKeywords)) {
    keywordDensity = Math.max(20, 100 - (output.missingKeywords.length * 8));
  }

  // 4. ATS Optimization
  let ats = null;
  if (typeof output.atsScore === "number") {
    ats = Math.min(100, Math.max(0, output.atsScore));
  } else if (typeof output.improvedATS === "number") {
    ats = Math.min(100, Math.max(0, output.improvedATS));
  } else if (typeof output.matchScore === "number") {
    ats = Math.min(100, Math.max(0, output.matchScore));
  } else if (typeof output.hiringFitScore === "number") {
    ats = Math.min(100, Math.max(0, output.hiringFitScore));
  }

  // 5. Professional Tone & Recruiter Score
  let professionalism = null;
  if (typeof output.professionalismScore === "number") {
    professionalism = Math.min(100, Math.max(0, output.professionalismScore));
  }

  // 6. Completeness
  // Fields where an empty array means "good" (no issues found), not "data missing".
  const positiveEmptyFields = new Set(['grammarIssues', 'missingKeywords', 'weaknesses']);
  let emptyFields = 0;
  let totalFields = 0;
  const traverse = (obj, parentKey) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        totalFields++;
        if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
          emptyFields++;
        } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
          // Only count as empty if this isn't a "positive when empty" field
          if (!positiveEmptyFields.has(key)) {
            emptyFields++;
          }
        } else if (typeof obj[key] === "object") {
          traverse(obj[key], key);
        }
      }
    }
  };
  traverse(output, null);
  const completeness = totalFields > 0 ? Math.round(((totalFields - emptyFields) / totalFields) * 100) : 90;

  // 7. Practicality (Specific Actionable suggestions)
  let suggestionsCount = 0;
  const listKeys = ["suggestions", "recommendations", "steps", "factors", "reasons", "criticalFeedback", "weakPhrases", "changes", "keyHighlights"];
  listKeys.forEach(key => {
    if (Array.isArray(output[key])) {
      suggestionsCount += output[key].length;
    }
  });
  const practicality = Math.min(100, 60 + (suggestionsCount * 8));

  const scoreAts = ats ?? 0;
  const scoreReadability = readability ?? 0;
  const scoreKeywords = keywordDensity ?? 0;
  const scoreProfessionalism = professionalism ?? 0;

  // Overall Score (Prefer model's explicit score; otherwise weighted average of measurements)
  const overall = typeof output.overallScore === 'number'
    ? output.overallScore
    : Math.round(
        (grammar * 0.15) +
        (scoreReadability * 0.15) +
        (scoreKeywords * 0.15) +
        (scoreAts * 0.20) +
        (scoreProfessionalism * 0.15) +
        (completeness * 0.10) +
        (practicality * 0.10)
      );

  return {
    grammar,
    readability: scoreReadability,
    keywordDensity: scoreKeywords,
    ats: scoreAts,
    professionalism: scoreProfessionalism,
    completeness,
    practicality,
    overall,
    modelReportedScore: output.atsScore ?? output.matchScore ?? output.overallScore ?? null
  };
};

/**
 * Rates multiple parallel model results and selects the category winners.
 * 
 * @param {string} feature The feature key
 * @param {array} results Array of model result runs
 * @returns {object} { resultsWithScores, bestOverall, bestATS, bestGrammar, bestRecruiter, bestSpeed }
 */
const evaluateArenaRun = (feature, results) => {
  const scoredResults = results.map(res => {
    if (res.error) {
      return {
        ...res,
        scores: { grammar: 0, readability: 0, keywordDensity: 0, ats: 0, professionalism: 0, completeness: 0, practicality: 0, overall: 0 }
      };
    }
    const scores = scoreOutput(feature, res.output, res.executionTime);
    return {
      ...res,
      scores
    };
  });

  // Exclude error logs from winner calculations
  const validResults = scoredResults.filter(r => !r.error);

  if (validResults.length === 0) {
    return {
      results: scoredResults,
      winner: null,
      bestResults: { bestOverall: null, bestATS: null, bestGrammar: null, bestRecruiter: null, bestSpeed: null }
    };
  }

  // Calculate Winners
  let bestOverall = validResults[0];
  let bestATS = validResults[0];
  let bestGrammar = validResults[0];
  let bestRecruiter = validResults[0];
  let bestSpeed = validResults[0];

  validResults.forEach(r => {
    if (r.scores.overall > bestOverall.scores.overall) bestOverall = r;
    if (r.scores.ats > bestATS.scores.ats) bestATS = r;
    if (r.scores.grammar > bestGrammar.scores.grammar) bestGrammar = r;
    if (r.scores.professionalism > bestRecruiter.scores.professionalism) bestRecruiter = r;
    if (r.executionTime < bestSpeed.executionTime) bestSpeed = r;
  });

  return {
    results: scoredResults,
    winner: bestOverall.model,
    bestResults: {
      bestOverall: bestOverall.model,
      bestATS: bestATS.model,
      bestGrammar: bestGrammar.model,
      bestRecruiter: bestRecruiter.model,
      bestSpeed: bestSpeed.model
    }
  };
};

module.exports = {
  scoreOutput,
  evaluateArenaRun
};
