import express from "express"
import { signUpUser ,LoginUser, logoutUser } from "../controllers/user.controller.js"
const router = express.Router()

router.route("/sign_up").post(signUpUser)
router.route("login").post(LoginUser)
router.route("/logout").post(logoutUser)

export default router


