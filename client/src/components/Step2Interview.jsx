import React from 'react'
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState, useRef, useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

// ============ AI AVATAR ============
function AiAvatar({ isPlaying, gender }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const faceColor = gender === 'male' ? '#FDBCB4' : '#F5CBA7';
    const hairColor = gender === 'male' ? '#2C1810' : '#8B4513';
    const shirtColor = gender === 'male' ? '#2E86AB' : '#E85D9A';

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let j = 0; j < H; j += 30) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }
      const grd = ctx.createRadialGradient(W/2, H*0.38, 10, W/2, H*0.38, 90);
      grd.addColorStop(0, isPlaying ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.18)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(W/2, H*0.38, 90, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = shirtColor; ctx.beginPath(); ctx.ellipse(W/2, H*0.85, 75, 65, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = faceColor; ctx.fillRect(W/2-18, H*0.56, 36, 30);
      ctx.beginPath(); ctx.ellipse(W/2, H*0.42, 62, 72, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = hairColor;
      if (gender === 'male') {
        ctx.beginPath(); ctx.ellipse(W/2, H*0.3, 63, 40, 0, Math.PI, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2-55, H*0.42, 10, 30, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2+55, H*0.42, 10, 30, 0, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.ellipse(W/2, H*0.3, 65, 42, 0, Math.PI, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2-58, H*0.48, 13, 52, -0.2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2+58, H*0.48, 13, 52, 0.2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2-55, H*0.66, 14, 26, -0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W/2+55, H*0.66, 14, 26, 0.3, 0, Math.PI*2); ctx.fill();
      }
      const blinkVal = Math.sin(t*0.8); const eyeH = blinkVal > 0.97 ? 1 : 8;
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.ellipse(W/2-22, H*0.41, 9, eyeH, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(W/2+22, H*0.41, 9, eyeH, 0, 0, Math.PI*2); ctx.fill();
      if (eyeH > 2) {
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(W/2-18, H*0.405, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(W/2+26, H*0.405, 2.5, 0, Math.PI*2); ctx.fill();
      }
      ctx.strokeStyle = hairColor; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(W/2-32, H*0.375); ctx.quadraticCurveTo(W/2-22, H*0.365, W/2-12, H*0.375); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W/2+12, H*0.375); ctx.quadraticCurveTo(W/2+22, H*0.365, W/2+32, H*0.375); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W/2, H*0.44); ctx.quadraticCurveTo(W/2+10, H*0.48, W/2+6, H*0.50); ctx.stroke();
      const mouthOpen = isPlaying ? Math.abs(Math.sin(t*8))*10 : 0; const mouthY = H*0.525;
      ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W/2-18, mouthY); ctx.quadraticCurveTo(W/2, mouthY+6+mouthOpen, W/2+18, mouthY); ctx.stroke();
      if (mouthOpen > 2) {
        ctx.fillStyle = '#8B0000';
        ctx.beginPath(); ctx.moveTo(W/2-14, mouthY+2); ctx.quadraticCurveTo(W/2, mouthY+4+mouthOpen, W/2+14, mouthY+2); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = faceColor;
      ctx.beginPath(); ctx.ellipse(W/2-63, H*0.42, 10, 16, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(W/2+63, H*0.42, 10, 16, 0, 0, Math.PI*2); ctx.fill();
      const pulse = 0.7 + Math.sin(t*3)*0.3;
      ctx.fillStyle = isPlaying ? `rgba(16,185,129,${pulse})` : 'rgba(59,130,246,0.7)';
      ctx.beginPath(); ctx.arc(W-24, 24, 7, 0, Math.PI*2); ctx.fill();
      if (isPlaying) {
        for (let w = 1; w <= 3; w++) {
          const wOpacity = (0.6-w*0.15)*Math.abs(Math.sin(t*4+w));
          ctx.strokeStyle = `rgba(16,185,129,${wOpacity})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(W/2, H*0.42, 75+w*18, Math.PI*1.1, Math.PI*1.9); ctx.stroke();
          ctx.beginPath(); ctx.arc(W/2, H*0.42, 75+w*18, Math.PI*0.1, Math.PI*0.9); ctx.stroke();
        }
      }
    };
    const animate = () => { timeRef.current += 0.016; draw(timeRef.current); animRef.current = requestAnimationFrame(animate); };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, gender]);

  return <canvas ref={canvasRef} width={320} height={320} style={{ width: '100%', borderRadius: '16px' }} />;
}

// ============ MAIN COMPONENT ============
function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef(null);
  const isMicOnRef = useRef(false);
  const isAIPlayingRef = useRef(false);
  const isRecognitionRunningRef = useRef(false);
  const retryCountRef = useRef(0);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interimText, setInterimText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [micStatus, setMicStatus] = useState("idle");
  const [permissionStatus, setPermissionStatus] = useState("unknown");

  const currentQuestion = questions[currentIndex];

  useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
  useEffect(() => { isAIPlayingRef.current = isAIPlaying; }, [isAIPlaying]);

  // ✅ Request microphone permission on mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        console.log("🎤 Requesting microphone permission...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionStatus("granted");
        console.log("✅ Microphone permission GRANTED");
        // Stop the stream immediately - we just needed to request permission
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("❌ Mic permission error:", error.name, error.message);
        if (error.name === "NotAllowedError") {
          setPermissionStatus("denied");
          alert("❌ Microphone permission denied.\n\nPlease:\n1. Check browser settings\n2. Allow microphone access\n3. Refresh the page");
        } else if (error.name === "NotFoundError") {
          setPermissionStatus("not-found");
          alert("🔇 No microphone detected.\n\nPlease connect a microphone.");
        } else if (error.name === "SecurityError") {
          setPermissionStatus("denied");
          alert("🔒 HTTPS required for microphone access.");
        } else {
          setPermissionStatus("unknown");
        }
      }
    };
    requestMicPermission();
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const fv = voices.find(v => v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("female"));
      if (fv) { setSelectedVoice(fv); setVoiceGender("female"); return; }
      const mv = voices.find(v => v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("male"));
      if (mv) { setSelectedVoice(mv); setVoiceGender("male"); return; }
      setSelectedVoice(voices[0]); setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ✅ Setup SpeechRecognition ONCE — lazy init on first use
  useEffect(() => {
    // Don't initialize yet - wait for first mic click
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) { }
      }
    };
  }, []);

  // Lazy initialize recognition on first click
  const initializeRecognition = () => {
    if (recognitionRef.current) return; // Already initialized

    console.log("🔧 Initializing Speech Recognition...");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("❌ Speech Recognition API not available");
      alert("Your browser doesn't support voice recording. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("✅ 🎙️ Recognition STARTED - listening...");
      console.log("📡 Checking internet connectivity...");
      isRecognitionRunningRef.current = true;
      setMicStatus("listening");
    };

    recognition.onresult = (event) => {
      console.log("📊 onresult - got", event.results.length, "results, resultIndex:", event.resultIndex);
      let finalTranscript = "";
      let interimTranscript = "";

      // Process all results from resultIndex onwards
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || "";
        
        if (!transcript) {
          console.warn("⚠️ Empty transcript at index", i);
          continue;
        }

        if (event.results[i].isFinal) {
          console.log("✅ Final result:", transcript);
          finalTranscript += transcript + " ";
        } else {
          console.log("📝 Interim result:", transcript);
          interimTranscript += transcript;
        }
      }

      // Update answer with final transcripts
      if (finalTranscript.trim()) {
        console.log("✅ Updating answer with:", finalTranscript.trim());
        setAnswer(prev => {
          const updated = prev + finalTranscript;
          console.log("📝 New answer state:", updated);
          return updated;
        });
        setInterimText("");
      } 
      // Show interim text for real-time feedback
      else if (interimTranscript.trim()) {
        console.log("🎙️ Showing interim text:", interimTranscript);
        setInterimText(interimTranscript);
      }
    };

    recognition.onend = () => {
      console.log("⏹️ Recognition ended");
      isRecognitionRunningRef.current = false;
      setMicStatus("idle");
      setInterimText("");
      // Auto-restart if user still wants to record
      if (isMicOnRef.current && !isAIPlayingRef.current && retryCountRef.current < 5) {
        setTimeout(() => {
          if (isMicOnRef.current && !isRecognitionRunningRef.current) {
            try { 
              retryCountRef.current++;
              recognition.start(); 
            } catch (e) { console.error("Restart error:", e); }
          }
        }, 500);
      }
    };

    recognition.onerror = (e) => {
      console.error("❌ Speech Recognition Error:", e.error);
      console.error("📊 Error details:", {
        error: e.error,
        isMicOn: isMicOnRef.current,
        isRecognitionRunning: isRecognitionRunningRef.current,
        permissionStatus: permissionStatus
      });
      
      isRecognitionRunningRef.current = false;
      setMicStatus("error");

      if (e.error === 'not-allowed') {
        setIsMicOn(false);
        isMicOnRef.current = false;
        alert("❌ Microphone permission denied.\n\nPlease:\n1. Click the lock icon in your browser\n2. Allow microphone access\n3. Refresh and try again");
      } else if (e.error === 'network') {
        console.warn("⚠️ Network error - Speech Recognition API unreachable");
        console.warn("📡 Possible causes:");
        console.warn("  1. No internet connection");
        console.warn("  2. Google's speech servers are unreachable");
        console.warn("  3. Browser firewall is blocking the connection");
        
        // Check if browser has internet
        fetch('https://www.google.com', { mode: 'no-cors' })
          .then(() => {
            console.log("✅ Internet is available - retrying speech recognition");
            setMicStatus("idle");
            if (isMicOnRef.current && retryCountRef.current < 5) {
              setTimeout(() => {
                if (isMicOnRef.current && !isRecognitionRunningRef.current) {
                  try { 
                    retryCountRef.current++;
                    console.log("🔄 Retry attempt", retryCountRef.current, "of 5");
                    recognition.start(); 
                  } catch (err) { console.error("Retry failed:", err); }
                }
              }, 1000);
            }
          })
          .catch(() => {
            console.error("❌ No internet connection detected");
            alert("❌ No internet connection.\n\nThe microphone feature requires internet access to work.\n\nPlease:\n1. Check your internet connection\n2. Refresh the page\n3. Try again\n\nAlternatively, you can type your answer manually.");
            setIsMicOn(false);
            isMicOnRef.current = false;
          });
      } else if (e.error === 'no-speech') {
        console.log("🤐 No speech detected - retrying...");
        setMicStatus("idle");
        if (isMicOnRef.current && retryCountRef.current < 5) {
          setTimeout(() => {
            if (isMicOnRef.current && !isRecognitionRunningRef.current) {
              try { 
                retryCountRef.current++;
                console.log("🔄 Restarting recognition (attempt", retryCountRef.current, ")");
                recognition.start(); 
              } catch (err) { console.error("Restart failed:", err); }
            }
          }, 500);
        }
      } else {
        console.log("ℹ️ Other error:", e.error);
        // Retry for unknown errors
        if (isMicOnRef.current && retryCountRef.current < 3) {
          console.log("🔄 Retrying after unknown error...");
          setTimeout(() => {
            if (isMicOnRef.current && !isRecognitionRunningRef.current) {
              try { 
                retryCountRef.current++;
                recognition.start();
              } catch (err) { }
            }
          }, 500);
        }
      }
    };

    recognitionRef.current = recognition;
  };

  const startMic = () => {
    console.log("\n▶️ startMic called");
    
    // Initialize if not already done
    if (!recognitionRef.current) {
      console.log("🔧 Lazy initializing recognition...");
      initializeRecognition();
      // Try again after init
      return setTimeout(() => startMic(), 200);
    }
    
    if (isAIPlayingRef.current) {
      console.log("❌ Skip: AI playing");
      return;
    }
    if (isRecognitionRunningRef.current) {
      console.log("❌ Skip: already running");
      return;
    }
    
    try { 
      console.log("▶️ Starting recognition.start()");
      recognitionRef.current.start();
    } catch (e) { 
      console.error("❌ start() error:", e.message);
      setMicStatus("error");
    }
  };

  const stopMic = () => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.abort(); } catch (e) { }
    isRecognitionRunningRef.current = false;
    retryCountRef.current = 0;
    setMicStatus("idle");
    setInterimText("");
  };

  const toggleMic = () => {
    console.log("🔘 toggleMic clicked");
    if (isMicOn) {
      console.log("🛑 Turning OFF mic");
      stopMic();
      setIsMicOn(false);
      isMicOnRef.current = false;
      retryCountRef.current = 0;
    } else {
      console.log("▶️ Turning ON mic");
      if (permissionStatus !== "granted") {
        console.error("❌ Permission not granted:", permissionStatus);
        alert("Microphone permission not granted. Please grant permission in browser settings.");
        return;
      }
      
      // Initialize recognition if needed
      if (!recognitionRef.current) {
        initializeRecognition();
      }
      
      setIsMicOn(true);
      isMicOnRef.current = true;
      retryCountRef.current = 0;
      
      // Small delay before starting
      setTimeout(() => {
        if (!isAIPlayingRef.current && !isRecognitionRunningRef.current) {
          startMic();
        }
      }, 200);
    }
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) { resolve(); return; }
      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92; utterance.pitch = 1.05; utterance.volume = 1;
      utterance.onstart = () => {
        setIsAIPlaying(true);
        isAIPlayingRef.current = true;
        stopMic();
      };
      utterance.onend = () => {
        setIsAIPlaying(false);
        isAIPlayingRef.current = false;
        if (isMicOnRef.current) {
          setTimeout(() => {
            if (isMicOnRef.current && !isAIPlayingRef.current && !isRecognitionRunningRef.current) {
              startMic();
            }
          }, 600);
        }
        setTimeout(() => { setSubtitle(""); resolve(); }, 300);
      };
      utterance.onerror = () => {
        setIsAIPlaying(false);
        isAIPlayingRef.current = false;
        resolve();
      };
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.");
        setIsIntroPhase(false);
        // ✅ Auto-enable mic after intro completes (only if permission granted)
        if (permissionStatus === "granted") {
          setTimeout(() => {
            setIsMicOn(true);
            isMicOnRef.current = true;
            retryCountRef.current = 0;
            console.log("▶️ Auto-starting mic after intro");
            setTimeout(() => startMic(), 100);
          }, 500);
        }
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) await speakText("Alright, this one might be a bit more challenging.");
        await speakText(currentQuestion.question);
        if (isMicOnRef.current && !isRecognitionRunningRef.current) {
          setTimeout(() => startMic(), 500);
        }
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex, permissionStatus]);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
      setAnswer(""); setInterimText("");
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion && timeLeft === 0 && !isSubmitting && !feedback) submitAnswer();
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (e) { } }
      window.speechSynthesis.cancel();
    };
  }, []);

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic(); setIsSubmitting(true);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId, questionIndex: currentIndex, answer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true });
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) { console.error(error); setIsSubmitting(false); }
  };

  const handleNext = async () => {
    setAnswer(""); setFeedback(""); setInterimText("");
    if (currentIndex + 1 >= questions.length) { finishInterview(); return; }
    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
  };

  const finishInterview = async () => {
    stopMic(); setIsMicOn(false); isMicOnRef.current = false;
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish", { interviewId }, { withCredentials: true });
      onFinish(result.data);
    } catch (error) { console.error(error); }
  };

  const formatTime = (secs) => {
    if (secs >= 60) { const m = Math.floor(secs/60), s = secs%60; return `${m}:${s.toString().padStart(2,'0')}`; }
    return `${secs}s`;
  };

  return (
    <div className='min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-6xl min-h-[80vh] bg-zinc-900 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800 flex flex-col lg:flex-row overflow-hidden'>

        {/* LEFT PANEL */}
        <div className='w-full lg:w-[35%] bg-zinc-900/50 flex flex-col items-center p-6 space-y-4 border-r border-zinc-800'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <AiAvatar isPlaying={isAIPlaying} gender={voiceGender} />
          </div>

          <div className='w-full max-w-md flex items-center justify-between px-1'>
            <span className='text-sm font-semibold text-zinc-100'>
              {voiceGender === 'male' ? '👨 AI Interviewer' : '👩 AI Interviewer'}
            </span>
            {isAIPlaying && (
              <span className='flex items-center gap-1.5 text-xs font-semibold text-emerald-600'>
                <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
                Speaking...
              </span>
            )}
          </div>

          {subtitle && (
            <div className='w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-xl p-3 shadow-sm'>
              <p className='text-zinc-300 text-xs font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

          <div className='w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-md p-5 space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-zinc-400'>Interview Status</span>
              {isAIPlaying && <span className='text-xs font-semibold text-emerald-600'>AI Speaking</span>}
            </div>
            <div className="h-px bg-zinc-800"></div>
            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>
            <div className='text-center'>
              <span className={`text-sm font-semibold ${timeLeft < 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                {formatTime(timeLeft)} remaining
              </span>
            </div>
            <div className="h-px bg-zinc-800"></div>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <span className='text-xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-xs text-zinc-500 block'>Current</span>
              </div>
              <div>
                <span className='text-xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-zinc-500 block'>Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-400 mb-6'>
            🤖 AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className='mb-4 bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-zinc-700 shadow-sm'>
              <p className='text-xs text-zinc-400 mb-2'>
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p className='text-base sm:text-lg font-semibold text-zinc-100 leading-relaxed'>
                {currentQuestion?.question}
              </p>
            </div>
          )}

          <div className='flex-1 flex flex-col min-h-[200px]'>
            <textarea
              placeholder="Type your answer here or click mic to speak..."
              onChange={(e) => {
                console.log("⌨️ Manual type - setting answer to:", e.target.value);
                setAnswer(e.target.value);
              }}
              value={answer}
              className="flex-1 bg-zinc-950 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-zinc-700 focus:ring-2 focus:ring-emerald-500/50 transition text-zinc-300 min-h-[180px]"
            />
            {interimText && (
              <div className="mt-2 px-4 py-2 bg-emerald-900/20 border border-emerald-800/50 rounded-xl">
                <span className="text-emerald-500 text-sm italic">🎙️ {interimText}</span>
              </div>
            )}
            {micStatus === 'error' && (
              <div className="mt-2 px-4 py-3 bg-red-900/20 border border-red-800/50 rounded-xl">
                <p className="text-red-400 text-xs font-medium">
                  ⚠️ <strong>Network Connection Issue</strong><br/>
                  Microphone feature requires internet. Please:<br/>
                  • Check your internet connection<br/>
                  • Refresh the page and try again<br/>
                  • Or type your answer manually below
                </p>
              </div>
            )}
          </div>

          {!feedback ? (
            <div className='flex items-center gap-3 mt-4'>
              <div className='flex flex-col items-center gap-1'>
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-lg transition-all ${
                    isMicOn
                      ? micStatus === 'listening'
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/50'
                        : 'bg-zinc-800 text-emerald-400 border border-emerald-900'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                  }`}>
                  {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                </motion.button>
                <span className='text-xs text-zinc-500'>
                  {isMicOn ? micStatus === 'listening' ? '🔴 Live' : 'On' : 'Off'}
                </span>
                {micStatus === 'error' && (
                  <span className='text-xs text-red-600 font-semibold max-w-[80px] text-center'>
                    ⚠️ Network Issue
                  </span>
                )}
              </div>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className='flex-1 bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] py-3 sm:py-4 rounded-2xl hover:bg-emerald-500 transition font-semibold disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none'>
                {isSubmitting ? "Evaluating..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-4 bg-zinc-950 border border-zinc-700 p-5 rounded-2xl shadow-sm'>
              <div className='flex items-start gap-2 mb-4'>
                <span className='text-emerald-500 text-lg'>💬</span>
                <p className='text-zinc-300 font-medium'>{feedback}</p>
              </div>
              <button
                onClick={handleNext}
                className='w-full bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] py-3 rounded-xl hover:bg-emerald-500 transition flex items-center justify-center gap-2 font-semibold'>
                {currentIndex + 1 >= questions.length ? 'Finish Interview' : 'Next Question'}
                <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview