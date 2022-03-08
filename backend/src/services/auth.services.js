import createError from "http-errors";
import Users from "../models/user.model";
import bcrypt from "bcrypt";
import { env } from "*/config/environment";
import jwt from "jsonwebtoken";

const registerServices = async (body) => {
  try {
    const { fullname, username, email, password, gender } = body;

    const user_name = await Users.findOne({ username });
    if (user_name) throw createError(400, "User name exits");

    const user_email = await Users.findOne({ email });
    if (user_email) throw createError(400, "Email exits");

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      fullname,
      username,
      email,
      password: passwordHash,
      gender,
    });

    await newUser.save();

    return {
      ...newUser._doc,
      password: "",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginServices = async (body) => {
  try {
    const { email, password } = body;
    const user = await Users.findOne({ email }).populate(
      "followers following",
      "avatar username fullname followers following"
    );

    if (!user) throw createError(400, "This email does not exits");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(400, "Password is incorrect !");

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    return {
      user: {
        ...user._doc,
        password: "",
      },
      access_token,
      refresh_token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const generateAccessTokenServices = async (req) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) throw createError(400, "Please login now !");

    jwt.verify(rf_token, env.REFRESH_TOKEN_SECRET, async (err, result) => {
      if (err) throw createError(400, "Please login now !");

      const user = await Users.findById(result.id)
        .select("-password")
        .populate(
          "followers following",
          "avatar username fullname followers following"
        );

      if (!user) throw createError(400, "This does not exits !");

      const access_token = createAccessToken({ id: result.id });

      return {
        access_token,
        user,
      };
    });
  } catch (err) {
    throw new Error(error.message);
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

export const authServices = {
  registerServices,
  loginServices,
  generateAccessTokenServices,
};
