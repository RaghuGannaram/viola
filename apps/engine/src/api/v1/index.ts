import audioRouter from "@src/routes/audio.route";
import authRouter from "@src/routes/auth.route";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.use("/auth", authRouter);

router.use("/audio", audioRouter);

export default router;
