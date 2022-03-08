import Joi from "joi";

const commonRequired = {
  string: Joi.string().required().trim().max(25),
};

const schemas = {
  validateRequestRegister: Joi.object({
    fullname: commonRequired.string,
    username: commonRequired.string,
    email: commonRequired.string.email(),
    password: Joi.string().required(),
    gender: Joi.string(),
  }),
  validateRequestLogin: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  schemas,
};
