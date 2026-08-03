import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-transparent flex justify-center px-4 pb-10 py-4 pt-10'>
      <div className='w-full max-w-6xl bg-zinc-900/80 rounded-[24px] shadow-sm border border-zinc-800 py-8 px-3 text-center'>
        <div className='flex justify-center items-center gap-3 mb-3'>
            <div className='bg-emerald-600 text-white p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]'><BsRobot size={16}/></div>
            <h2 className='font-semibold text-zinc-100'>TALENT-SCOPE</h2>
        </div>
        <p className='text-zinc-400 text-sm max-w-xl mx-auto'>
  AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>


      </div>
    </div>
  )
}

export default Footer
