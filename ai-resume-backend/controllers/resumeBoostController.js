const { enhanceBullet } = require("../services/bulletEnhancerService");
const { analyzeWeakLanguage } = require("../services/weakLanguageService");
const ResumeBoost = require("../models/ResumeBoost");
const WeakLanguage = require("../models/WeakLanguage");

const enhanceSingle = async (req, res) => {
  try {
    const { bullet, role } = req.body;

    if (!bullet || bullet.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide a valid bullet point." });
    }

    const data = await enhanceBullet(bullet, role);

    // Save to DB
    await ResumeBoost.create({
      userId: req.user._id,
      originalBullet: data.original,
      enhancedBullet: data.enhanced
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Bullet enhance error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const scanWeakLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please provide valid resume text." });
    }

    const data = await analyzeWeakLanguage(text);

    // Save weak phrases to DB
    if (data.weakPhrases && data.weakPhrases.length > 0) {
      const docs = data.weakPhrases.map(phrase => ({
        userId: req.user._id,
        weakPhrase: phrase.original,
        improvedPhrase: phrase.improved,
        score: data.scoreImprovement
      }));
      await WeakLanguage.insertMany(docs);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Weak language scan error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enhanceSingle, scanWeakLanguage };
