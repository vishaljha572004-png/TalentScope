import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../utils/askAi.js";

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }

        const filepath = req.file.path
        const filebuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(filebuffer)

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            // ✅ FIX 1: system prompt moved to first user message (OpenRouter supports system role but this is safer)
            {
                role: "system",
                content: `You are a resume parser. Extract structured data from the resume provided.
                Return ONLY valid JSON, no extra text, no markdown, no backticks:
                {
                    "role": "string",
                    "experience": "string",
                    "projects": ["project1", "project2"],
                    "skills": ["skill1", "skill2"]
                }`
            },
            {
                role: "user",
                content: `Parse this resume and return JSON only:\n\n${resumeText}`
            }
        ];

        const aiResponse = await askAi(messages)

        // ✅ FIX 2: check if aiResponse is null before using it
        if (!aiResponse) {
            return res.status(500).json({ message: "AI failed to analyze resume. Check your API key." });
        }

        // ✅ FIX 3: parse cleanJson not aiResponse
        const cleanJson = aiResponse.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(cleanJson) // ✅ was JSON.parse(aiResponse) before

        // ✅ FIX 4: await the file deletion
        await fs.promises.unlink(filepath)

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });

    } catch (error) {
        console.log(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message });
    }
};
