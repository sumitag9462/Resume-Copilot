const ContactQuery = require('../models/ContactQuery');

exports.submitQuery = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }

    const newQuery = await ContactQuery.create({ name, email, message });

    res.status(201).json({
      message: 'Query submitted successfully. We will get back to you soon!',
      data: newQuery
    });
  } catch (error) {
    next(error);
  }
};
