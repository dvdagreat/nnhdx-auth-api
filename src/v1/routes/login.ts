import { Router, Request, Response } from "express";
import { loginController } from "../controllers/LoginController";

export const router = Router();

router.post("/", loginController.login);
