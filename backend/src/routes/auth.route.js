import express from "express";
import { authController } from "*/controllers/auth.controller";
import { validateBody } from "*/middleware/validationRouter";
import { schemas } from "../validations/users.request";

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.validateRequestRegister),
  authController.register
);

router.post(
  "/login",
  validateBody(schemas.validateRequestLogin),
  authController.login
);

router.get("/logout", authController.logout);

router.get("/generate-token", authController.generateAccessToken);

export const authRouter = router;
