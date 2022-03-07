import express from "express";
import { authRouter } from "./auth.route";

const router = express.Router();

// define router authentication with login logout
router.use("/auth", authRouter);

export const api = router;
