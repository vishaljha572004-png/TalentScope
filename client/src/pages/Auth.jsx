import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Auth({isModel = false}) {
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            dispatch(setUserData(result.data))
            


            
        } catch (error) {
            console.log(error)
              dispatch(setUserData(null))
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-transparent flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:1.05}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-zinc-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800
      `}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-emerald-600 text-white p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]'>
                    <BsRobot size={18}/>

                </div>
                <h2 className='font-semibold text-lg text-zinc-100'>TALENT-SCOPE</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4 text-zinc-100'>
                Continue with
                <span className='bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full inline-flex items-center gap-2 ml-2'>
                    <IoSparkles size={16}/>
                    AI Smart Interview

                </span>
            </h1>

            <p className='text-zinc-400 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>


            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.03}}
            whileTap={{opacity:1 , scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-zinc-700 transition'>
                <FcGoogle size={20}/>
                Continue with Google

   
            </motion.button>
        </motion.div>

      
    </div>
  )
}

export default Auth