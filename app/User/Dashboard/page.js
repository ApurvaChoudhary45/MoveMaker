"use client";
import Navbar from "@/components/Navbar";
import { Dumbbell, Flame, Lightbulb, Zap, ChevronRight, Sparkles, Play, StopCircle, CircleArrowLeft, Circle, CircleAlert, ListRestart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";
import Spin from "@/components/Spin";
import { useSelector, useDispatch } from 'react-redux'
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function HomePage() {
    const darker = useSelector(state => state.dark.mode)
    const [idea, setIdea] = useState('')
    const { user, isLoaded } = useUser();
     const { isSignedIn } = useAuth()
    const [timerModal, setTimerModal] = useState(false)
    const [exercise, setexercise] = useState(null)
    const [count, setcount] = useState(0)
    const timerRef = useRef(null)
    const [instructions, setInstructions] = useState(false)
    const [loading, setloading] = useState(false)
    const [text, settext] = useState('')
    
    const [botModal, setBotModal] = useState(false)
    const [badgeInfo, setbadgeInfo] = useState(null)
    const [completed, setcompleted] = useState(false)
    const [userEx, setuserEx] = useState([])
    const router = useRouter()

    useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])


    const badges = [
        {
            icon: "https://cdn-icons-png.flaticon.com/128/1616/1616456.png",
            text: "Complete your first workout"
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/128/11297/11297546.png",
            text: "Create 10 workouts"
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/128/18315/18315037.png",
            text: "Explore 10 exercises"
        },
        {
            icon: "https://cdn-icons-png.flaticon.com/128/599/599502.png",
            text: "Maintain a 7-day streak"
        }
    ];
    const collection = [{ main: 'Top 5 Shoulder Mobility Drills', slug: 'shoulder' }, { main: 'Beginner-Friendly Core Finishers', slug: 'core' }, { main: 'Improve Flexibility in 7 Minutes', slug: 'flexibility' }]
    const announcements = [
        "New: Daily Mobility Routines added for faster warm-ups!",
        "🔥 Streaks feature is live — don not break your chain!",
        "Tip: Try the 7-Minute Core Finisher for a quick burn.",
        "Reminder: Hydrate before starting your workout!",
        "New Collection added: Full Body Stretch Series.",
        "⭐ You earned a badge! Keep up the consistency.",
        "Challenge Released: 5-Day Flexibility Boost.",
        "Try the new Morning Energizer routine to start fresh!",
        "Your form matters — slow and controlled > fast and sloppy.",
        "Update: Dark mode is now available in settings.",
        "New exercises added to Strength & Conditioning.",
        "Set your weekly goal to stay on track every day.",
        "New: Share your workout progress with your friends!",
        "Tip: Warm up for at least 3 minutes before any session.",
        "New Collection: Shoulder Stability & Mobility Series is live!"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            let index = Math.floor(Math.random() * announcements.length)
            settext(announcements[index])
        }, 2000);
        return () => clearInterval(interval)
    }, [])
    useEffect(() => {
        const fetcher = async () => {
            const data = await fetch('/api/extra')
            const res = await data.json()
            console.log(res?.getWorkout[0])
            setuserEx(res?.getWorkout[0])
        }
        fetcher()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            let index = Math.floor(Math.random() * badges.length)
            setbadgeInfo(badges[index])
        }, 4000);
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        let intervalId;
        setloading(true);
        const fetcher = async () => {

            try {
                const response = await fetch(
                    "/api/exercise"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch exercises");
                }

                const result = await response.json();

                const data = result?.data || [];

                if (data.length > 0) {
                    intervalId = setInterval(() => {
                        const index = Math.floor(Math.random() * data.length);
                        setexercise(data[index]);
                    }, 10000);
                }
            } catch (error) {
                console.log("Found Error:", error);
            } finally {
                setloading(false);
            }
        };

        fetcher();

        // cleanup interval
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);



    const closeModal = () => {
        setTimerModal(false)
    }
    const startTImer = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setcount(count => count + 1)
        }, 1000);
    }
    const stopTimer = () => {
        clearInterval(timerRef.current)
    }
    const resetTimer = () => {
        setcount(0)
        clearInterval(timerRef.current)
        timerRef.current = null

    }
    const fitnessTips = [
        "Strong core = strong body. Add 5 minutes of core activation before every workout to improve stability and posture.",

        "Focus on form, not weight. Proper technique activates the right muscles and prevents long-term injuries.",

        "Hydration boosts performance. Drink water throughout the day — not just during workouts.",

        "Progressive overload is the key to growth. Increase reps, sets, or weight gradually every week.",

        "Sleep is your superpower. Aim for 7 to 9 hours to improve recovery, strength, and fat loss.",

        "Warm up for 5 to 10 minutes to improve mobility, reduce stiffness, and maximize performance.",

        "Eat enough protein. Target 1.2 to 2g per kg of body weight daily to support muscle repair.",

        "Take rest days seriously. Your muscles grow and recover when you rest, not during workouts.",

        "Train mindfully. Slow, controlled reps lead to better muscle activation than rushing through sets.",

        "Consistency beats intensity. Even short workouts done daily outperform long, inconsistent sessions."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            let random = Math.floor(Math.random() * 10)
            setIdea(fitnessTips[random])
        }, 5000);

        return () => clearInterval(interval)

    }, [])

    const openInst = () => {
        setInstructions(true)
    }

    const closeInst = () => {
        setInstructions(false)
    }


    return (
        <>
            <Navbar />
            {timerModal && <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl z-50">
                <div className="bg-white max-w-6xl rounded-2xl shadow-lg border p-10 flex flex-col md:flex-row gap-6">
                    <button className="absolute top-3 right-3 text-white hover:text-black" onClick={closeModal}>
                        ✕
                    </button>

                    <div>
                        <h1 className="text-center text-8xl">{count}</h1>
                        <div className="flex gap-10 mt-5">
                            <button className="text-xl flex gap-3 p-3 rounded-2xl bg-gray-200" onClick={startTImer}><Play className="text-blue-400" />Start</button>
                            <button className="text-xl flex gap-3 p-3 rounded-2xl bg-gray-200" onClick={stopTimer}><StopCircle className="text-red-600" />Stop</button>
                            <button className="text-xl flex gap-3 p-3 rounded-2xl bg-gray-200" onClick={resetTimer}><ListRestart className="text-gray-700" />Reset</button>
                        </div>
                    </div>

                </div>




            </div>}
            <div className={`min-h-screen p-6 md:p-10 
${darker ? 'bg-gray-50 text-black' : 'bg-black text-white'}`}>

                {/* Greeting */}
                <h1 className={`text-3xl font-semibold tracking-tight 
${darker ? 'text-black' : 'text-white'}`}>
                    Welcome back, Athlete 👋
                </h1>
                <p className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                    Ready to elevate your performance today?
                </p>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {userEx?.plan === 'premium' && <Link href='/User/CreateWorkOut'><QuickAction title="Create Workout" icon={<Dumbbell className="w-6 h-6 hover:text-amber-300" />} /></Link>}
                    <Link href='/User/Exercises'><QuickAction title="Explore Exercises" icon={<Flame className="w-6 h-6 hover:text-red-600" />} /></Link>
                    <QuickAction title="Start Timer" icon={<Zap className="w-6 h-6 hover:text-blue-500" onClick={() => setTimerModal(true)} />} />
                    {userEx?.plan === 'premium' && <Link href='/User/MyLibrary'><QuickAction title="My Library" icon={<ChevronRight className="w-6 h-6 hover:text-gray-600" />} /></Link>}
                </div>

                {/* Daily Tip */}
                <div className={`mt-10 p-5 rounded-2xl shadow-md 
${darker
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white'}`}>
                    <h2 className="text-lg font-medium flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Today is Tip
                    </h2>
                    <p className="mt-2 text-sm">
                        {idea}
                    </p>
                </div>

                {/* Featured Exercise of the Day */}
                {loading ? <Spin /> : <div className={`mt-8 rounded-xl shadow-sm p-5 flex flex-col md:flex-row gap-6
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    {exercise?.gifUrl && <Image
                        src={exercise?.gifUrl}
                        height={40}
                        width={40}
                        alt="Exercise"
                        className="w-full md:w-40 h-40 object-cover rounded-lg"
                    />}
                    <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            Featured Exercise <Sparkles className="w-5 h-5 text-[#ff8c00]" />
                        </h3>
                        <p className="mt-2 font-medium">{exercise?.name?.toUpperCase()}</p>
                        <ul className={`${darker ? 'text-gray-600' : 'text-gray-400'} text-sm mt-2 list-disc ml-5`}>
                            <li>Targets {exercise?.secondaryMuscles[0]} and {exercise?.secondaryMuscles[1]}</li>
                            <li>Perfect for explosive {exercise?.targetMuscles[0]} power</li>
                        </ul>
                        <button className={`max-w-4xl rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-6
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white border-gray-700'}`} onClick={openInst}>
                            View Instructions →
                        </button>
                    </div>
                </div>}

                {instructions &&
                    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl z-60">
                        <div className=" bg-white max-w-4xl rounded-2xl shadow-lg border p-10 flex flex-col md:flex-row gap-6">

                            {/* ❌ Close Button */}
                            <button className="absolute top-3 right-3  text-white hover:scale-105 cursor-pointer" onClick={closeInst}>
                                ✕
                            </button>

                            {/* LEFT SECTION – DETAILS */}
                            <div className="flex-1 space-y-4">

                                {/* Exercise Name */}
                                <h2 className={`text-3xl font-bold ${darker ? 'text-gray-800' : 'text-white'}`}>
                                    {exercise?.name?.toUpperCase()}
                                </h2>



                                {/* Instructions */}
                                <div>
                                    <h3 className={`text-lg font-semibold mb-2 
${darker ? 'text-gray-700' : 'text-gray-300'}`}>Instructions:</h3>
                                    <ul className={`list-disc pl-5 space-y-1 
${darker ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {exercise?.instructions?.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <li>{item}</li>
                                                </div>
                                            )
                                        })}
                                    </ul>
                                </div>

                            </div>

                            {/* RIGHT SECTION – IMAGE/GIF */}
                            <div className="w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
                                <Image
                                    src={exercise?.gifUrl}
                                    height={40}
                                    width={40}
                                    alt="Exercise GIF"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>
                    </div>
                }

                {/* Workout Categories */}
                <h2 className="mt-10 text-xl font-semibold">Explore Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Link href='/User/Featured/chest'><button className="bg-gradient-to-r from-red-500 to-orange-400 p-4 rounded-2xl  text-2xl w-full hover:scale-105 transition-all delay-150 cursor-pointer" >Chest</button></Link>
                    <Link href='/User/Featured/Shoulders'><button className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 rounded-2xl text-2xl w-full hover:scale-105 transition-all delay-150 cursor-pointer"  >Shoulders</button></Link>
                    <Link href='/User/Featured/Cardio'><button className="bg-gradient-to-r from-purple-500 to-pink-400 p-4 rounded-2xl text-2xl w-full hover:scale-105 transition-all delay-150 cursor-pointer" >Cardio</button></Link>
                    <Link href='/User/Featured/Legs'><button className="bg-gradient-to-r from-green-500 to-emerald-400 p-4 rounded-2xl text-2xl w-full hover:scale-105 transition-all delay-150 cursor-pointer" >Legs</button></Link>
                </div>

                {/* Curated Collections */}
                <h2 className="mt-12 text-xl font-semibold">Curated For You</h2>
                <div className="space-y-4 mt-4">
                    {Array.isArray(collection) && collection?.map((item, index) => {
                        return (
                            <div className={`p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`} key={index}>
                                <p className={`${darker ? 'text-gray-800' : 'text-gray-200'} font-medium`}>{item?.main}</p>
                                <Link href={`/User/Collection/${item?.slug}`}><p className={`${darker ? 'text-gray-500' : 'text-gray-400'} text-sm mt-1`}>Open Collection →</p></Link>
                            </div>
                        )
                    })}
                </div>

                <div className="md:flex justify-around items-center gap-20">
                    <div className={`w-full max-w-md mx-auto backdrop-blur-md rounded-2xl p-6 shadow-lg mt-10
${darker ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}`}>

                        {/* Tagline */}
                        <h2 className={`${darker ? 'text-black' : 'text-white'} font-medium`}>
                            Earn New Badges
                        </h2>

                        {/* Badge Requirement */}
                        <div className="flex items-center gap-4 p-4 rounded-xl">
                            {/* Locked Icon */}
                            <div className="w-16 h-16  rounded-full flex items-center justify-center">
                                {badgeInfo?.icon && (
                                    <Image
                                        src={badgeInfo.icon}
                                        width={64}
                                        height={64}
                                        alt="Badge"
                                        className="h-16 w-16 rounded-full"
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div>
                                <p className={`${darker ? 'text-black' : 'text-white'} font-medium`}>{badgeInfo?.text}</p>
                                <p className="text-gray-400 text-sm">Unlock this achievement</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-full max-w-md mx-auto bg-orange-400/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg mt-10">

                        {/* Tagline */}
                        <h2 className="text-xl font-semibold ">
                            View daily challenges/Quests🪙
                        </h2>

                        {/* Badge Requirement */}
                        <div className="flex items-center gap-4 p-4 rounded-xl">
                            {/* Locked Icon */}
                            <div className="w-16 h-16  rounded-full flex items-center justify-center">
                                {/* <img src='' className="h-16 w-16 rounded-full" /> */}
                            </div>

                            {/* Text */}
                            <div className="flex justify-center items-center gap-5 flex-col">
                                <p className="text-black text-md text-center">Crush a task. Collect your reward🔥</p>
                                <Link href='/User/Tasks'><p className="underline hover:text-orange-600 cursor-pointer">View tasks</p></Link>
                            </div>

                        </div>

                    </div>
                </div>


                {/* AI Assistant */}
                {userEx?.plan === 'premium' && <div className={`mt-12 p-6 rounded-2xl shadow-sm
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    <h3 className="text-lg font-semibold">Ask MoveMaker AI</h3>
                    <p className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-1 text-sm`}>
                        Ask about form, routines, injuries, or best exercises.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition" onClick={() => setBotModal(true)}>
                        Ask Now
                    </button>
                </div>}
                {botModal && <Chatbot onClose={() => setBotModal(false)} />}

                {/* Announcements */}
                <h2 className="mt-12 text-xl font-semibold">Announcements</h2>
                <div className={`mt-3 p-4 rounded-xl text-sm border
${darker
                        ? 'bg-yellow-50 text-yellow-900 border-yellow-200'
                        : 'bg-yellow-900/20 text-yellow-300 border-yellow-700'}`}>
                    🔥{text}
                </div>

            </div>
        </>
    );
}

function QuickAction({ title, icon }) {
    const darker = useSelector(state => state.dark.mode)
    return (
        <div className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition
${darker
                ? 'bg-white text-black shadow-sm hover:shadow-md'
                : 'bg-gray-900 text-white border border-gray-700 hover:bg-gray-800'}`}>
            {icon}
            <p className="mt-2 font-medium text-gray-700">{title}</p>
        </div>
    );
}

function CategoryCard({ label, color }) {
    return (
        <div className={`rounded-xl p-5 text-white font-semibold bg-gradient-to-r ${color} shadow-md cursor-pointer hover:opacity-90 transition`}>
            {label}
        </div>
    );
}



