import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import { askAi } from "../services/openRouter.service.js"

export const analyzeAts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" })
        }

        const { jobDescription } = req.body

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job description required" })
        }

        const filepath = req.file.path
        const fileBuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(fileBuffer)

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise

        let resumeText = ""
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const content = await page.getTextContent()
            const pageText = content.items.map(item => item.str).join(" ")
            resumeText += pageText + "\n"
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim()
        fs.unlinkSync(filepath)

        const messages = [
            {
                role: "system",
                content: `
You are an expert ATS (Applicant Tracking System) analyzer.

Analyze the resume against the job description and return ONLY valid JSON.

Return this exact format:
{
  "atsScore": number (0-100),
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "formatScore": number (0-100),
  "keywordScore": number (0-100),
  "experienceScore": number (0-100),
  "summary": "2-3 sentence overall summary"
}

Rules:
- atsScore = overall ATS compatibility score
- matchedKeywords = keywords from job description found in resume (max 10)
- missingKeywords = important keywords from job description missing in resume (max 10)
- strengths = what resume does well (exactly 3 points)
- improvements = what needs to be improved (exactly 3 points)
- formatScore = how ATS friendly the format is
- keywordScore = keyword match percentage
- experienceScore = experience relevance score
- summary = brief honest overall assessment
`
            },
            {
                role: "user",
                content: `
Resume:
${resumeText}

Job Description:
${jobDescription}
`
            }
        ]

        const aiResponse = await askAi(messages)
        const parsed = JSON.parse(aiResponse)

        return res.status(200).json(parsed)

    } catch (error) {
        console.error(error)
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        return res.status(500).json({ message: `ATS analysis failed: ${error.message}` })
    }
}