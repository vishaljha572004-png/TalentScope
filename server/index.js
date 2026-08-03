import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDb from "./config/connectDb.js"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import atsRouter from "./routes/ats.route.js"  // ← add karo

dotenv.config()

const app = express()  

app.use(cors({
    origin: "https://talentscope-client.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ats", atsRouter)  // ← add karo

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})