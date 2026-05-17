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
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-10 px-6'>
            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='flex items-center gap-4 mb-10'>
                    <button
                        onClick={() => navigate("/")}
                        className='p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                        <FaArrowLeft className='text-gray-600' />
                    </button>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>ATS Resume Checker</h1>
                        <p className='text-gray-500 mt-1'>Check how well your resume matches the job description</p>
                    </div>
                </div>

                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-3xl shadow-md border border-gray-100 p-8'>

                        {/* Resume Upload */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Upload Resume (PDF)
                            </label>
                            <label className='w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition'>
                                <FaUpload className='text-gray-400 mb-3' size={28} />
                                <p className='text-gray-500 text-sm'>
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
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                rows={8}
                                className='w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 resize-none'
                            />
                        </div>

                        {error && (
                            <p className='text-red-500 text-sm mb-4'>{error}</p>
                        )}

                        <motion.button
                            onClick={handleAnalyze}
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className='w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50'>
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
                                <div key={i} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center'>
                                    <div className='w-20 h-20 mb-3'>
                                        <CircularProgressbar
                                            value={item.value}
                                            text={`${item.value}%`}
                                            styles={buildStyles({
                                                textSize: '22px',
                                                pathColor: getScoreColor(item.value),
                                                textColor: getScoreColor(item.value),
                                                trailColor: '#f3f4f6',
                                            })}
                                        />
                                    </div>
                                    <p className='text-sm font-semibold text-gray-700'>{item.label}</p>
                                    <p className='text-xs mt-1' style={{ color: getScoreColor(item.value) }}>
                                        {getScoreLabel(item.value)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                            <h3 className='font-semibold text-gray-800 mb-2'>Overall Summary</h3>
                            <p className='text-gray-600 text-sm leading-relaxed'>{result.summary}</p>
                        </div>

                        {/* Keywords */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                                <h3 className='font-semibold text-gray-800 mb-4'>
                                    ✅ Matched Keywords
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {result.matchedKeywords.map((kw, i) => (
                                        <span key={i} className='bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium'>
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                                <h3 className='font-semibold text-gray-800 mb-4'>
                                    ❌ Missing Keywords
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className='bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium'>
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                                <h3 className='font-semibold text-gray-800 mb-4'>💪 Strengths</h3>
                                <div className='space-y-3'>
                                    {result.strengths.map((s, i) => (
                                        <div key={i} className='flex items-start gap-3'>
                                            <FaCheckCircle className='text-emerald-500 mt-0.5 flex-shrink-0' />
                                            <p className='text-sm text-gray-600'>{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                                <h3 className='font-semibold text-gray-800 mb-4'>🔧 Improvements</h3>
                                <div className='space-y-3'>
                                    {result.improvements.map((imp, i) => (
                                        <div key={i} className='flex items-start gap-3'>
                                            <FaTimesCircle className='text-red-400 mt-0.5 flex-shrink-0' />
                                            <p className='text-sm text-gray-600'>{imp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-4'>
                            <button
                                onClick={() => setResult(null)}
                                className='flex-1 border border-gray-300 py-3 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition'>
                                Check Another Resume
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className='flex-1 bg-black text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition'>
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