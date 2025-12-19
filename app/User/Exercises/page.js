'use client'
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser } from '@clerk/nextjs';
import { motion } from "framer-motion";
import Image from "next/image";
export default function ExercisesPage() {
    let { user } = useUser()
    const query = useSelector(state => state.searched.search)
    const [exercise, setexercise] = useState([])
    const [search, setSearch] = useState('')
    const [modal, setmodal] = useState(false)
    const [singleExe, setSingleExe] = useState(null)
    const [marked, setmarked] = useState(false)
    const [count, setcount] = useState(0)
    const darker = useSelector(state => state.dark.mode)
    const [history, sethistory] = useState({
        name: '',
        targetMuscles: '',
        secondaryMuscles: []
    })
    const closeModal = () => {
        setmodal(false)
    }
    const closeBadge = () => {
        setmarked(false)
    }
    const today = new Date(Date.now()).toISOString()
    const badgeImg = 'https://cdn-icons-png.flaticon.com/128/18315/18315037.png'
    const addBadge = async (url) => {
        let badgeInfo = {
            badgeUrl: url,
            userID: user?.id
        }
        const data = await fetch('/api/showbadge', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(badgeInfo),
        })
        setmarked(false)
    }
    useEffect(() => {
        const fetcher = async () => {
            try {
                if (query) {
                    // User searched → fetch filtered data
                    const newData = await fetch(`https://exercisedb-api.vercel.app/api/v1/exercises?offset=0&limit=10&search=${query}`)
                    const res = await newData.json()
                    setexercise(res?.data)
                } else {
                    // No search → load default exercises
                    const newData = await fetch('https://exercisedb-api.vercel.app/api/v1/exercises?offset=0&limit=10')
                    const res = await newData.json()
                    setexercise(res?.data)
                }
            } catch (err) {
                console.log("Error fetching exercises")
            }
        }

        fetcher()
    }, [query])

    const searchExercise = async (search) => {
        try {
            const newData = await fetch(`https://exercisedb-api.vercel.app/api/v1/exercises?offset=20&limit=10&&search=${search}&sortBy=targetMuscles&sortOrder=desc`)
            const res = await newData.json()
            setexercise(res?.data)
        } catch (error) {
            console.log('Hey unable to get the data')
        }

    }
    const getSingleExercise = async (exerciseID) => {
        const singleData = await fetch(`http://exercisedb-api.vercel.app/api/v1/exercises/${exerciseID}`)
        const res = await singleData.json()
        console.log(res?.data)
        setSingleExe(res?.data)
        let obj = {
            name: res?.data?.name,
            targetMuscles: res?.data?.targetMuscles,
            secondaryMuscles: res?.data?.secondaryMuscles,
            userID: user?.id,
            date: today

        }
        const data = await fetch('/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })

        const newdata = await fetch('/api/recenthistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })
        const res1 = await newdata.json()
        setcount(res1?.getWorkout?.length)
        if (res1?.getWorkout?.length === 10) {
            setmarked(true)
        }

    }
    const nextPage = async (offset) => {
        try {
            const newData = await fetch(`https://exercisedb-api.vercel.app/api/v1/exercises?offset=${offset}&limit=10&&search=${search}&sortBy=targetMuscles&sortOrder=desc`)
            const res = await newData.json()
            setexercise(res?.data)
        } catch (error) {
            console.log('Hey unable to get the data')
        }

    }
    return (
        <>
            <Navbar />
            <div className={`min-h-screen p-6
${darker ? 'bg-gray-50 text-black' : 'bg-black text-white'}`}>

                {/* HEADER */}
                <div className="max-w-6xl mx-auto mb-8">
                    <h1 className={`text-4xl font-extrabold tracking-tight
${darker ? 'text-gray-800' : 'text-white'}`}>
                        Exercise Library
                    </h1>
                    <p className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                        Learn proper technique, target specific muscles, and explore 60+ exercises.
                    </p>
                </div>

                {/* SEARCH + FILTERS */}
                <div className="max-w-6xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row gap-3 items-center">

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search an exercise..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full md:w-1/2 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none
  ${darker
                                    ? 'bg-white text-black border border-gray-300'
                                    : 'bg-gray-900 text-white border border-gray-700 placeholder-gray-400'}`}
                        />

                        {/* Search */}
                        <div className="flex gap-3 flex-wrap">
                            <button className={`px-4 py-2 rounded-xl shadow-sm transition
  ${darker
                                    ? 'bg-white border text-gray-700 hover:bg-blue-100'
                                    : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800'}`} onClick={() => searchExercise(search)}>
                                Search
                            </button>

                        </div>
                    </div>
                </div>

                {modal &&
                    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl z-60">
                        <div className=" bg-white max-w-4xl rounded-2xl shadow-lg border p-10 flex flex-col md:flex-row gap-6">

                            {/* ❌ Close Button */}
                            <button className="absolute top-3 right-3  text-white hover:text-black" onClick={closeModal}>
                                ✕
                            </button>

                            {/* LEFT SECTION – DETAILS */}
                            <div className="flex-1 space-y-4">

                                {/* Exercise Name */}
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {singleExe?.name?.toUpperCase()}
                                </h2>



                                {/* Instructions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Instructions:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                        {singleExe?.instructions?.map((item, index) => {
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
                                    src={singleExe?.gifUrl}
                                    alt="Exercise GIF"
                                    className="w-full h-full object-cover"
                                    height={50}
                                    width={50}
                                />
                            </div>

                        </div>
                    </div>
                }

                {/* EXERCISE GRID */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* ==== CARD === */}
                    {Array.isArray(exercise) && exercise?.map((i) => (
                        <div
                            key={i.exerciseId}
                            className={`rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1
  ${darker ? 'bg-white text-black' : 'bg-gray-900 text-white border-gray-700'}`}
                        >
                            {/* Thumbnail */}
                            <div className="h-48 w-full rounded-t-2xl overflow-hidden">
                                <Image
                                    src={i?.gifUrl}
                                    alt="exercise"
                                    className="w-full h-full object-cover"
                                    width={80}
                                    height={100}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                {/* Title */}
                                <h2 className={`text-xl font-semibold
${darker ? 'text-gray-800' : 'text-white'}`}>{i?.name.toUpperCase()}</h2>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium
${darker ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-300'}`}>
                                        {i?.targetMuscles?.[0]}
                                    </span>
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium
${darker ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-300'}`}>
                                        {i?.secondaryMuscles?.[1]}
                                    </span>
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium
${darker ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-300'}`}>
                                        {i?.secondaryMuscles?.[0]}
                                    </span>
                                </div>

                                {/* Learn More */}
                                <button className={`mt-2 w-full py-2 rounded-xl transition
  ${darker
                                        ? 'bg-gray-900 text-white hover:bg-gray-700'
                                        : 'bg-gray-800 text-white hover:bg-gray-700'}`} onClick={() => { getSingleExercise(i?.exerciseId), setmodal(true) }}>
                                    Learn Technique →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="flex items-center justify-center gap-3 mt-10">


                {/* Page Numbers */}
                <div className="flex gap-2 ">
                    {[...Array(15)].map((_, i) => (

                        <button
                            key={i}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition
  ${darker
    ? 'bg-white text-gray-700 hover:bg-gray-900 hover:text-white'
    : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-white hover:text-black'}`}
                            onClick={() => nextPage((i + 1 - 1) * 10)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>


            </div>
            <footer className={`px-6 md:px-20 py-6 border-t text-sm flex justify-between mt-4
${darker ? 'border-gray-200 text-gray-700' : 'border-gray-700 text-gray-400'}`}>
                <p>© {new Date().getFullYear()} MoveMaker. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#">GitHub</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </footer>
            {marked && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center
  ${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
                >
                    <div className='absolute cursor-pointer text-orange-400 font-bold hover:text-orange-300' onClick={closeBadge}>X</div>
                    {/* Badge Icon Placeholder */}
                    <div className="w-24 h-24 mx-auto bg-yellow-300 rounded-full shadow-md flex items-center justify-center text-4xl font-bold">
                        <Image src={badgeImg} alt="" height={24} width={24}  />

                    </div>


                    <h2 className="text-xl font-semibold mt-4">Congratulations!</h2>
                    <p className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
                        You have earned a new badge
                    </p>

                    <div className="mt-3 text-lg font-medium text-orange-500">
                        <span>Badge Type: </span>
                        <span className="font-bold">Explore 10 workouts</span>
                    </div>

                    <button className="mt-5 bg-orange-600 text-white w-full py-3 rounded-xl font-medium hover:bg-orange-500 transition-all" onClick={() => addBadge(badgeImg)}>
                        Add to Profile
                    </button>
                </motion.div>
            </div>}
        </>
    );
}
