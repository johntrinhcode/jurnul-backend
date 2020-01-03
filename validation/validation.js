const joi = require("@hapi/joi");

const registerValidate = data => {
  const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi
      .string()
      .required()
      .email(),
    password: joi
      .string()
      .min(6)
      .required()
  });

  return registerSchema.validate(data);
};

const loginValidate = data => {
  const registerSchema = joi.object({
    email: joi
      .string()
      .required()
      .email(),
    password: joi
      .string()
      .min(6)
      .required()
  });

  return registerSchema.validate(data);
};
module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
