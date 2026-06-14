// GoogleGenerativeAI imported within aiHelper if needed.

/**
 * Service to generate cold emails and LinkedIn messages using Gemini AI
 */
class OutreachService {
  async generateOutreachContent(user, data) {
    try {
      const { targetRole, companyName, tone = 'professional', resumeText } = data;

      const prompt = `
        You are an expert career coach and networking strategist.
        Create a cold outreach package for a candidate trying to connect with professionals or recruiters.
        
        Candidate Name: ${user.name}
        Target Role: ${targetRole}
        Target Company: ${companyName}
        Tone: ${tone}

        Candidate Resume:
        """
        ${resumeText || 'No resume provided.'}
        """

        Please provide:
        1. A compelling Email Subject Line
        2. A concise, professional Cold Email Body (under 150 words)
        3. A short LinkedIn Connection Request Message (under 300 characters)

        STRICT INSTRUCTION: Base your outreach strictly on the candidate's actual experience and skills from the resume provided above. Do NOT invent or hallucinate skills, tools, metrics, or projects. If a specific skill isn't in the resume, don't mention it.

        Format the response in JSON with the following keys:
        - emailSubject
        - emailBody
        - linkedinMessage
      `;

      const { generateContentWithFallback } = require('./aiHelper');
      
      const result = await generateContentWithFallback(prompt);
      const responseText = result.response.text();
      
      const match = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const jsonStr = match ? match[0] : responseText.trim();

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Outreach Generation Error:', error);
      throw new Error('Failed to generate outreach content');
    }
  }
}

module.exports = new OutreachService();
