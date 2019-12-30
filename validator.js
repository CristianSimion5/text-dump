const { body, validationResult } = require('express-validator');
const userValidationRules = () => {
  return [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'E-mail is invalid').isEmail(),
    body('username', 'Username is required').not().isEmpty(),
    body('password', 'Password must contain at least 5 characters').isLength({ min: 5 }),
    body('password_confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match the password');
        }
        return true;
    })
  ]
}

const dumpValidationRules = () => {
  return [
    body('title', 'Title is required').not().isEmpty(),
    body('body', 'The file is empty').notEmpty()
  ]
}

const validate = (req, res, next) => {
  req.errors = validationResult(req);
  next();
}

module.exports = {
  userValidationRules,
  dumpValidationRules,
  validate,
}