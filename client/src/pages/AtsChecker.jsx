import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaUpload } from 'react-icons/fa'
import { motion } from 'motion/react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function AtsChecker() {
    const navigate = useNavigate()
    const [resume, setResume] = useState(null)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const handleAnalyze = async () => {
        if (!resume) return setError("Please upload your resume")
        if (!jobDescription.trim()) return setError("Please enter job description")

        setError("")
        setLoading(true)
        setResult(null)

        try {
            const formData = new FormData()
            formData.append("resume", resume)
            formData.append("jobDescription", jobDescription)

            const response = await axios.post(
                ServerUrl + "/api/ats/analyze",
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            setResult(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Analysis failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 75) return "#10b981"
        if (score >= 50) return "#f59e0b"
        return "#ef4444"
    }

    const getScoreLabel = (score) => {
        if (score >= 75) return "Excellent"
        if (score >= 50) return "Average"
        return "Needs Work"
    }

    return (
        <div className='min-h-screen bg-transparent py-10 px-6'>
            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='flex items-center gap-4 mb-10'>
                    <button
                        onClick={() => navigate("/")}
                        className='p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition'>
                        <FaArrowLeft className='text-zinc-300' />
                    </button>
                    <div>
                        <h1 className='text-3xl font-bold text-zinc-100'>ATS Resume Checker</h1>
                        <p className='text-zinc-400 mt-1'>Check how well your resume matches the job description</p>
                    </div>
                </div>

                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-zinc-900/80 rounded-3xl border border-zinc-800 p-8'>

                        {/* Resume Upload */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                                Upload Resume (PDF)
                            </label>
                            <label className='w-full border-2 border-dashed border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition bg-zinc-950/50'>
                                <FaUpload className='text-zinc-500 mb-3' size={28} />
                                <p className='text-zinc-400 text-sm'>
                                    {resume ? resume.name : "Click to upload your resume PDF"}
                                </p>
                                <input
                                    type='file'
                                    accept='.pdf'
                                    className='hidden'
                                    onChange={(e) => setResume(e.target.files[0])}
                                />
                            </label>
                        </div>

                        {/* Job Description */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                rows={8}
                                className='w-full bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none'
                            />
                        </div>

                        {error && (
                            <p className='text-red-500 text-sm mb-4'>{error}</p>
                        )}

                        <motion.button
                            onClick={handleAnalyze}
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className='w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500 transition disabled:opacity-50'>
                            {loading ? "Analyzing your resume..." : "Analyze Resume"}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-6'>

                        {/* Score Cards */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {[
                                { label: "ATS Score", value: result.atsScore },
                                { label: "Keywords", value: result.keywordScore },
                                { label: "Format", value: result.formatScore },
                                { label: "Experience", value: result.experienceScore },
                            ].map((item, i) => (
                                <div key={i} className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-5 flex flex-col items-center'>
                                    <div className='w-20 h-20 mb-3'>
                                        <CircularProgressbar
                                            value={item.value}
                                            text={`${item.value}%`}
                                            styles={buildStyles({
                                                textSize: '22px',
                                                pathColor: getScoreColor(item.value),
                                                textColor: getScoreColor(item.value),
                                                trailColor: '#27272a',
                                            })}
                                        />
                                    </div>
                                    <p className='text-sm font-semibold text-zinc-100'>{item.label}</p>
                                    <p className='text-xs mt-1' style={{ color: getScoreColor(item.value) }}>
                                        {getScoreLabel(item.value)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6'>
                            <h3 className='font-semibold text-zinc-100 mb-2'>Overall Summary</h3>
                            <p className='text-zinc-400 text-sm leading-relaxed'>{result.summary}</p>
                        </div>

                        {/* Keywords */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6'>
                                <h3 className='font-semibold text-zinc-100 mb-4'>
                                    ✅ Matched Keywords
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {result.matchedKeywords.map((kw, i) => (
                                        <span key={i} className='bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 text-xs px-3 py-1 rounded-full font-medium'>
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6'>
                                <h3 className='font-semibold text-zinc-100 mb-4'>
                                    ❌ Missing Keywords
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className='bg-red-900/30 text-red-400 border border-red-800/50 text-xs px-3 py-1 rounded-full font-medium'>
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6'>
                                <h3 className='font-semibold text-zinc-100 mb-4'>💪 Strengths</h3>
                                <div className='space-y-3'>
                                    {result.strengths.map((s, i) => (
                                        <div key={i} className='flex items-start gap-3'>
                                            <FaCheckCircle className='text-emerald-500 mt-0.5 flex-shrink-0' />
                                            <p className='text-sm text-zinc-400'>{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6'>
                                <h3 className='font-semibold text-zinc-100 mb-4'>🔧 Improvements</h3>
                                <div className='space-y-3'>
                                    {result.improvements.map((imp, i) => (
                                        <div key={i} className='flex items-start gap-3'>
                                            <FaTimesCircle className='text-red-400 mt-0.5 flex-shrink-0' />
                                            <p className='text-sm text-zinc-400'>{imp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-4'>
                            <button
                                onClick={() => setResult(null)}
                                className='flex-1 border border-zinc-700 bg-zinc-800 py-3 rounded-2xl text-zinc-300 font-semibold hover:bg-zinc-700 transition'>
                                Check Another Resume
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className='flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500 transition'>
                                Go Home
                            </button>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default AtsChecker