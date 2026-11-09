// tests/outputValidator.test.js — UNIT TESTS FOR STRICT SCHEMA & FACTUALITY VALIDATION (A10, A17, A18, A19)

const { validateFeatureOutput, clampScore } = require('../services/OutputValidator');
const { scoreOutput } = require('../services/ScoringEngine');
const { MODELS, DISTINCT_ARENA_MODELS } = require('../config/models');
const { FEATURES } = require('../config/features');

describe('Phase 3: OutputValidator & ScoringEngine Integrity', () => {

  describe('1. Model Configuration Truthfulness (A06)', () => {
    test('distinct arena models for comparison must never share the same underlying apiName', () => {
      const apiNames = DISTINCT_ARENA_MODELS.map(m => MODELS[m].apiName);
      const uniqueApiNames = new Set(apiNames);
      expect(uniqueApiNames.size).toBe(apiNames.length);
    });

    test('aliased models are explicitly marked with isAlias flag', () => {
      expect(MODELS['gemini-pro'].isAlias).toBe(true);
      expect(MODELS['gemini-flash-latest'].isAlias).toBe(true);
      expect(MODELS['gemini-2.5-flash'].isAlias).toBe(false);
      expect(MODELS['gemini-2.5-flash-lite'].isAlias).toBe(false);
    });
  });

  describe('2. ATS Analysis Schema Validation (A10, A17)', () => {
    test('rejects empty object {}', () => {
      const result = validateFeatureOutput('ats_analysis', {});
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/atsScore/i);
    });

    test('rejects out-of-bounds scores (e.g. atsScore = 150 or negative)', () => {
      const resultOver = validateFeatureOutput('ats_analysis', { atsScore: 150, overallScore: 80, suggestions: ['Fix this'] });
      expect(resultOver.valid).toBe(false);

      const resultNeg = validateFeatureOutput('ats_analysis', { atsScore: -5, overallScore: 80, suggestions: ['Fix this'] });
      expect(resultNeg.valid).toBe(false);
    });

    test('rejects non-numeric score strings', () => {
      const result = validateFeatureOutput('ats_analysis', { atsScore: 'high', overallScore: 80, suggestions: ['Fix this'] });
      expect(result.valid).toBe(false);
    });

    test('rejects missing suggestions array', () => {
      const result = validateFeatureOutput('ats_analysis', { atsScore: 80, overallScore: 85, suggestions: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/suggestions/i);
    });

    test('accepts valid ATS analysis output and sanitizes fields', () => {
      const validATS = {
        atsScore: 88,
        overallScore: 92,
        missingKeywords: ['Docker', 'AWS'],
        suggestions: ['Add measurable impact'],
        grammarIssues: [],
        strengths: ['Clear experience section'],
        weaknesses: ['Add more metrics'],
        formattingAnalysis: 'Clean linear text structure'
      };

      const result = validateFeatureOutput('ats_analysis', validATS);
      expect(result.valid).toBe(true);
      expect(result.sanitizedOutput.atsScore).toBe(88);
      expect(result.sanitizedOutput.overallScore).toBe(92);
      expect(result.sanitizedOutput.missingKeywords).toContain('Docker');
    });
  });

  describe('3. JD Match Schema Validation (A10)', () => {
    test('rejects missing matchScore', () => {
      const result = validateFeatureOutput('jd_match', { verdict: 'Strong Match' });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/matchScore/i);
    });

    test('normalizes invalid verdict based on score bounds', () => {
      const output = {
        matchScore: 85,
        skillCoverage: 90,
        keywordCoverage: 80,
        verdict: 'Crazy Good Match', // Non-standard verdict
        summary: 'Candidate matches well.'
      };
      const result = validateFeatureOutput('jd_match', output);
      expect(result.valid).toBe(true);
      expect(result.sanitizedOutput.verdict).toBe('Strong Match');
    });
  });

  describe('4. Factuality & Hallucination Prevention in Resume Boost (A18)', () => {
    test('replaces fabricated dollar revenue and percentages when original bullet has no metrics', () => {
      const original = 'Managed team and organized weekly sprints';
      const fabricatedAI = {
        original,
        enhanced: 'Spearheaded engineering team, generating $5.4M in revenue and increasing throughput by 320%'
      };

      const result = validateFeatureOutput('resume_boost', fabricatedAI, { bulletText: original });
      expect(result.valid).toBe(true);
      // Fabricated metrics replaced with bracketed placeholders
      expect(result.sanitizedOutput.enhanced).toContain('[$ metrics]');
      expect(result.sanitizedOutput.enhanced).toContain('[X%]');
      expect(result.sanitizedOutput.enhanced).not.toContain('$5.4M');
      expect(result.sanitizedOutput.factualityNote).toBeDefined();
    });

    test('preserves legitimate metrics when original bullet already included them', () => {
      const originalWithMetrics = 'Reduced latency by 45% and saved $20,000 annually';
      const output = {
        original: originalWithMetrics,
        enhanced: 'Optimized microservice architecture, slashing latency by 45% and saving $20,000 annually'
      };

      const result = validateFeatureOutput('resume_boost', output, { bulletText: originalWithMetrics });
      expect(result.valid).toBe(true);
      expect(result.sanitizedOutput.enhanced).toContain('45%');
      expect(result.sanitizedOutput.enhanced).toContain('$20,000');
    });
  });

  describe('5. Illustrative Guidance for Uncalibrated Predictive Outputs (A19)', () => {
    test('placement predictor automatically attaches illustrative guidance flag and disclaimer', () => {
      const output = {
        predictions: [
          { company: 'Google', probability: 75, confidence: 80, explanation: 'Strong distributed systems background' }
        ]
      };

      const result = validateFeatureOutput('placement_predictor', output);
      expect(result.valid).toBe(true);
      expect(result.sanitizedOutput.isIllustrativeGuidance).toBe(true);
      expect(result.sanitizedOutput.disclaimer).toMatch(/illustrative estimate/i);
    });

    test('salary estimator automatically attaches illustrative guidance flag and disclaimer', () => {
      const output = {
        salaryRange: { min: 120000, max: 160000, currency: 'USD' },
        marketDemand: 'High'
      };

      const result = validateFeatureOutput('salary_estimator', output);
      expect(result.valid).toBe(true);
      expect(result.sanitizedOutput.isIllustrativeGuidance).toBe(true);
      expect(result.sanitizedOutput.disclaimer).toMatch(/not verified compensation/i);
    });
  });

  describe('6. ScoringEngine Integrity (A10: No Invented 50/70/75 Scores)', () => {
    test('returns 0s for missing or invalid output instead of inventing 50/70/75 defaults', () => {
      const emptyScores = scoreOutput('ats_analysis', null, 100);
      expect(emptyScores.overall).toBe(0);
      expect(emptyScores.grammar).toBe(0);
      expect(emptyScores.ats).toBe(0);
      expect(emptyScores.readability).toBe(0);
      expect(emptyScores.keywordDensity).toBe(0);
    });

    test('separates model reported score from heuristic scores', () => {
      const mockOutput = {
        atsScore: 88,
        overallScore: 90,
        grammarIssues: []
      };

      const scores = scoreOutput('ats_analysis', mockOutput, 500);
      expect(scores.modelReportedScore).toBe(88);
      expect(scores.grammar).toBe(100);
      expect(scores.ats).toBe(88);
    });
  });

});

