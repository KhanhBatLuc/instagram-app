import { STATUS_CODE } from "../utils/contants";

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body, { abortEarly: false });

    if (validatorResult.error) {
      return res.status(STATUS_CODE.INPUT_FAIL).json({
        code: STATUS_CODE.INPUT_FAIL,
        error: validatorResult.error.details,
      });
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};
      req.value.body = validatorResult.value;
      next();
    }
  };
};

module.exports = {
  validateBody,
};
