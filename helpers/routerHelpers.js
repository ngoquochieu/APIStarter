const Joi = require('@hapi/joi');

const validateBody = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body);

    if (validateResult.error) {
      res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value['params']) req.value.params = {};

      req.value.body = validateResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validateResult = schema.validate({ param: req.params[name] });

    if (validateResult.error) {
      res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value['params']) req.value.params = {};

      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const schemas = {
  authSignUpSchema: Joi.object().keys({
    // firstName: Joi.string().min(2).required(),
    // lastName: Joi.string().min(2).required(),
     fullname: Joi.string().min(6).required(),
    // email: Joi.string()
    //   .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
    //   .required(),
    username: Joi.string().min(3).required(),
    phone: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(6).required(),
  }),

  authSignInSchema: Joi.object().keys({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  }),

  idSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
      .required(),
    password: Joi.string().min(6).required()
  }),
  

  userOption: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
  }),

  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
  }),

  newDeckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
  }),

  optionDeck: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

module.exports = {
  validateBody,
  validateParam,
  schemas,
};
