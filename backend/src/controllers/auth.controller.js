import { authServices } from "../services/auth.services";
import { STATUS_CODE } from "../utils/contants";

const register = async (req, res, next) => {
  try {
    // call service
    let data = await authServices.registerServices(req.body);
    return res.status(STATUS_CODE.OK).json(data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // call service
    let data = await authServices.loginServices(req.body);

    res.cookie("refreshtoken", data.refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    return res.status(STATUS_CODE.OK).json(data);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logged out!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const generateAccessToken = async (req, res, next) => {
  try {
    let data = await authServices.generateAccessTokenServices(req);
    return res.status(STATUS_CODE.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
  login,
  logout,
  generateAccessToken,
};
