import authController from "@src/controllers/auth.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh-token", authController.refresh);

router.delete("/logout", authController.logout);

export default router;
