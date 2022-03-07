const register = (req, res, next) => {
  try {
    // call service
    console.log(req);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
};
