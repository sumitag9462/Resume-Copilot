require('dotenv').config();
const { getGenAIInstance } = require('./services/KeyManager');

async function testStream() {
  try {
    const model = getGenAIInstance().getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContentStream('Hello');
    console.log('Stream started');
    for await (const chunk of result.stream) {
      console.log('Chunk:', chunk.text());
    }
    console.log('Stream finished successfully');
  } catch (error) {
    console.error('STREAM ERROR:', error);
  }
}

testStream();
