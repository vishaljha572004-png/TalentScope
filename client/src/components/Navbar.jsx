import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='bg-transparent flex justify-center px-4 pt-6'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-6xl bg-zinc-900/80 backdrop-blur-md rounded-[24px] shadow-sm border border-zinc-800 px-8 py-4 flex justify-between items-center relative'>
            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='bg-emerald-600 text-white p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]'>
                    <BsRobot size={18}/>

                </div>
                <h1 className='font-semibold hidden md:block text-lg text-zinc-100'>TALENT-SCOPE</h1>
            </div>

            <div className='flex items-center gap-6  relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-full text-md hover:bg-zinc-700 transition'>
                        <BsCoin size={20}/>
                        {userData?.credits || 0}
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-zinc-900 shadow-xl border border-zinc-800 rounded-xl p-5 z-50'>
                            <p className='text-sm text-zinc-400 mb-4'>Need more credits to continue interviews?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] py-2 rounded-lg text-sm transition'>Buy more credits</button>

                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{
                         if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                    }} className='w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]'>
                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>}
                        
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-zinc-900 shadow-xl border border-zinc-800 rounded-xl p-4 z-50'>
                            <p className='text-md text-emerald-400 font-medium mb-1'>{userData?.name}</p>

                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 hover:text-zinc-100 text-zinc-400 transition'>InterView History</button>
                            <button onClick={handleLogout} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-400 hover:text-red-300 transition'>
                                <HiOutlineLogout size={16}/>
                                Logout</button>
                        </div>
                    )}
                </div>

            </div>



        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
      
    </div>
  )
}

export default Navbar
