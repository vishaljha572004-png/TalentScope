import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { analyzeAts } from "../controllers/ats.controller.js"

const atsRouter = express.Router()

atsRouter.post("/analyze", isAuth, upload.single("resume"), analyzeAts)

export default atsRouter