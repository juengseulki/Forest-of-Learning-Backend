import axios from 'axios';

export async function translateText(req, res) {
  const { text, target } = req.body;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          target: target,
          key: process.env.GOOGLE_TRANSLATE_API_KEY,
        },
      }
    );

    const translated = response.data.data.translations[0].translatedText;

    return res.json({ translatedText: translated });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: '번역 실패' });
  }
}
