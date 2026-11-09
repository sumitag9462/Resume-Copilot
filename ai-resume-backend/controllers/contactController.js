const ContactQuery = require('../models/ContactQuery');
const { isSafeString, isValidEmail } = require('../utils/validationHelper');

/**
 * Handles public contact form inquiries with strict schema validation and length caps (A39).
 * @route POST /api/contact/submit
 */
exports.submitQuery = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!isSafeString(name, 2, 100)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name between 2 and 100 characters.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!isSafeString(message, 10, 2000)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message between 10 and 2000 characters.'
      });
    }

    const newQuery = await ContactQuery.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully. We will get back to you soon!',
      data: {
        id: newQuery._id,
        status: newQuery.status,
        createdAt: newQuery.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
