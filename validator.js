const { body, validationResult } = require('express-validator');
const userValidationRules = () => {
  return [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'E-mail is invalid').isEmail(),
    // password must be at least 5 chars long
    body('username', 'Username is Required').not().isEmpty(),
    body('password', 'Password must contain at least 5 characters').isLength({ min: 5 }),
    body('password_confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match the password');
        }
        return true;
    })
  ]
}


const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  // Can also use 400
  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}