// tests/arena.test.js — UNIT TESTS FOR ARENA ENGINES
//
// Verifies:
//   1. ModelRouter task routing mappings.
//   2. ScoringEngine scoring heuristics and categories.
//   3. Winner ratings and fastest speed evaluations.

const { getRouteModel } = require("../services/ModelRouter");
const { scoreOutput, evaluateArenaRun } = require("../services/ScoringEngine");

describe("AI Arena Routing & Scoring tests", () => {
  
  test("ModelRouter should route to the correct models in Auto and Manual mode", () => {
    // Manual select overrides auto
    expect(getRouteModel("ats_analysis", "gemini-2.5-flash-lite")).toBe("gemini-2.5-flash-lite");
    expect(getRouteModel("cover_letter", "gemini-pro")).toBe("gemini-pro");

    // Auto routing based on task complexity
    expect(getRouteModel("resume_boost", "auto")).toBe("gemini-2.5-flash-lite");
    expect(getRouteModel("jd_match", "auto")).toBe("gemini-2.5-flash");
    expect(getRouteModel("resume_rebuilder", "auto")).toBe("gemini-pro");
    expect(getRouteModel("cover_letter", "auto")).toBe("gemini-pro");
  });

  test("ScoringEngine should evaluate mock outputs and calculate correct metrics", () => {
    const mockOutput = {
      atsScore: 88,
      overallScore: 85,
      grammarIssues: ["Typo in bullet 2", "Missing comma"],
      matchedSkills: ["React", "Node.js"],
      missingSkills: ["Docker"],
      suggestions: ["Add more metrics", "Reformat education section"],
      reasons: ["Strong technical backgrounds"],
      hiringFitScore: 82
    };

    const scores = scoreOutput("ats_analysis", mockOutput, 1500);

    // Assert keys exist
    expect(scores).toHaveProperty("grammar");
    expect(scores).toHaveProperty("readability");
    expect(scores).toHaveProperty("keywordDensity");
    expect(scores).toHaveProperty("ats");
    expect(scores).toHaveProperty("professionalism");
    expect(scores).toHaveProperty("completeness");
    expect(scores).toHaveProperty("practicality");
    expect(scores).toHaveProperty("overall");

    // Check custom calculations
    expect(scores.grammar).toBe(70); // 100 - 2 * 15
    expect(scores.ats).toBe(88); // pulls from atsScore
    expect(scores.keywordDensity).toBe(67); // 2 matched / 3 total = 67%
  });

  test("evaluateArenaRun should pick the correct winners across categories", () => {
    const results = [
      {
        model: "gemini-2.5-flash-lite",
        executionTime: 800,
        output: { atsScore: 75, grammarIssues: ["Error 1"] }
      },
      {
        model: "gemini-2.5-flash",
        executionTime: 1200,
        output: { atsScore: 85, grammarIssues: [] }
      },
      {
        model: "gemini-pro",
        executionTime: 3500,
        output: { atsScore: 95, grammarIssues: [] }
      }
    ];

    const evaluation = evaluateArenaRun("ats_analysis", results);

    // Flash-lite should win on speed
    expect(evaluation.bestResults.bestSpeed).toBe("gemini-2.5-flash-lite");

    // Pro should win on ATS
    expect(evaluation.bestResults.bestATS).toBe("gemini-pro");

    // Pro should win overall
    expect(evaluation.winner).toBe("gemini-pro");
  });
});
