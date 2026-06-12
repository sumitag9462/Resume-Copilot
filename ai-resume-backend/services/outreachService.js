const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Service to generate cold emails and LinkedIn messages using Gemini AI
 */
class OutreachService {
  async generateOutreachContent(user, data) {
    try {
      const { targetRole, companyName, tone = 'professional' } = data;

      // Make sure we are using the reliable flash model as per current architecture
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
        You are an expert career coach and networking strategist.
        Create a cold outreach package for a candidate trying to connect with professionals or recruiters.
        
        Candidate Name: ${user.name}
        Target Role: ${targetRole}
        Target Company: ${companyName}
        Tone: ${tone}

        Please provide:
        1. A compelling Email Subject Line
        2. A concise, professional Cold Email Body (under 150 words)
        3. A short LinkedIn Connection Request Message (under 300 characters)

        Format the response in JSON with the following keys:
        - emailSubject
        - emailBody
        - linkedinMessage
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse JSON from markdown code block if present
      let jsonStr = responseText;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Outreach Generation Error:', error);
      throw new Error('Failed to generate outreach content');
    }
  }
}

module.exports = new OutreachService();
