import { Router } from "express";
import { registerStudent, loginStudent } from "../controllers/student.controllers.js";

const router = Router()

router.route("/register").post(registerStudent)
router.route("/login").post(loginStudent);

export default router;