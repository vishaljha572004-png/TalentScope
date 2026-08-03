import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div className='min-h-screen bg-transparent py-10' >
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition'><FaArrowLeft className='text-zinc-300' /></button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-zinc-100'>
                            Interview History
                        </h1>
                        <p className='text-zinc-400 mt-2'>
                            Track your past interviews and performance reports
                        </p>

                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className='bg-zinc-900/80 p-10 rounded-2xl border border-zinc-800 text-center'>
                        <p className='text-zinc-400'>
                            No interviews found. Start your first interview.
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                            onClick={()=>navigate(`/report/${item._id}`)}
                             className='bg-zinc-900/50 p-6 rounded-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300 cursor-pointer border border-zinc-800 hover:border-emerald-500/50'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100">
                                            {item.role}
                                        </h3>

                                        <p className="text-zinc-400 text-sm mt-1">
                                            {item.experience} • {item.mode}
                                        </p>

                                        <p className="text-xs text-zinc-500 mt-2">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-400">
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium border ${item.status === "completed"
                                                    ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
                                                    : "bg-yellow-900/30 text-yellow-400 border-yellow-800/50"
                                                }`}
                                        >
                                            {item.status}
                                        </span>


                                    </div>
                                </div>

                            </div>

                        ))
                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default InterviewHistory
