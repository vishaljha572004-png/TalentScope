import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import Interviewpage from "./pages/Interviewpage.jsx";
import InterviewHistory from "./pages/Interviewhistory.jsx";
import Pricing from "./pages/Pricing.jsx";
import AtsChecker from "./pages/AtsChecker.jsx";

export const ServerUrl = "http://localhost:8000"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<Interviewpage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/ats' element={<AtsChecker />} />
    </Routes>
  )
}

export default App