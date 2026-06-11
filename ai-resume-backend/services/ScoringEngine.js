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
      grammar: 50,
      readability: 50,
      keywordDensity: 50,
      ats: 50,
      professionalism: 50,
      completeness: 50,
      practicality: 50,
      overall: 50
    };
  }

  // Helper: flatten object to scan text content
  const allText = JSON.stringify(output).toLowerCase();

  // 1. Grammar Score
  let grammar = 85;
  if (Array.isArray(output.grammarIssues)) {
    grammar = Math.max(30, 100 - (output.grammarIssues.length * 15));
  } else if (typeof output.grammarScore === "number") {
    grammar = output.grammarScore;
  } else if (allText.includes("typo") || allText.includes("misspelling")) {
    grammar = 70;
  }

  // 2. Readability Score
  let readability = 80;
  if (typeof output.readabilityScore === "number") {
    readability = output.readabilityScore;
  } else if (typeof output.readability === "number") {
    readability = output.readability;
  } else {
    // Count bullets and headers in response text
    const bulletCount = (allText.match(/- |\* |\\n/g) || []).length;
    readability = Math.min(100, 70 + (bulletCount * 2));
  }

  // 3. Keyword Density / Match
  let keywordDensity = 75;
  if (typeof output.keywordCoverage === "number") {
    keywordDensity = output.keywordCoverage;
  } else if (typeof output.keywordMatch === "number") {
    keywordDensity = output.keywordMatch;
  } else if (Array.isArray(output.matchedSkills) && Array.isArray(output.missingSkills)) {
    const total = output.matchedSkills.length + output.missingSkills.length;
    keywordDensity = total > 0 ? Math.round((output.matchedSkills.length / total) * 100) : 75;
  } else if (output.keywordReport && Array.isArray(output.keywordReport.added)) {
    keywordDensity = Math.min(100, 60 + (output.keywordReport.added.length * 8));
  }

  // 4. ATS Optimization
  let ats = 70;
  if (typeof output.atsScore === "number") {
    ats = output.atsScore;
  } else if (typeof output.improvedATS === "number") {
    ats = output.improvedATS;
  } else if (typeof output.matchScore === "number") {
    ats = output.matchScore;
  } else if (typeof output.hiringFitScore === "number") {
    ats = output.hiringFitScore;
  } else {
    // If output includes standard professional keywords
    const keywords = ["scale", "optimize", "lead", "architect", "improve", "implement"];
    let matchCount = 0;
    keywords.forEach(kw => {
      if (allText.includes(kw)) matchCount++;
    });
    ats = Math.min(100, 65 + (matchCount * 5));
  }

  // 5. Professional Tone & Recruiter Score
  let professionalism = 80;
  if (typeof output.professionalismScore === "number") {
    professionalism = output.professionalismScore;
  } else {
    // Count professional action verbs
    const actionVerbs = ["spearheaded", "engineered", "designed", "optimized", "managed", "decreased", "increased", "boosted"];
    let verbCount = 0;
    actionVerbs.forEach(v => {
      if (allText.includes(v)) verbCount++;
    });
    professionalism = Math.min(100, 75 + (verbCount * 4));
  }

  // 6. Completeness
  let emptyFields = 0;
  let totalFields = 0;
  const traverse = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        totalFields++;
        if (obj[key] === null || obj[key] === undefined || obj[key] === "" || (Array.isArray(obj[key]) && obj[key].length === 0)) {
          emptyFields++;
        } else if (typeof obj[key] === "object") {
          traverse(obj[key]);
        }
      }
    }
  };
  traverse(output);
  const completeness = totalFields > 0 ? Math.round(((totalFields - emptyFields) / totalFields) * 100) : 90;

  // 7. Practicality (Specific Actionable suggestions)
  let suggestionsCount = 0;
  const listKeys = ["suggestions", "recommendations", "steps", "factors", "reasons", "criticalFeedback", "weakPhrases", "changes"];
  listKeys.forEach(key => {
    if (Array.isArray(output[key])) {
      suggestionsCount += output[key].length;
    }
  });
  const practicality = Math.min(100, 60 + (suggestionsCount * 8));

  // Overall Score (Weighted Average)
  const overall = Math.round(
    (grammar * 0.15) +
    (readability * 0.15) +
    (keywordDensity * 0.15) +
    (ats * 0.20) +
    (professionalism * 0.15) +
    (completeness * 0.10) +
    (practicality * 0.10)
  );

  return {
    grammar,
    readability,
    keywordDensity,
    ats,
    professionalism,
    completeness,
    practicality,
    overall
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
