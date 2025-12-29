'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Bell, BellDotIcon, Dumbbell, SearchIcon } from "lucide-react";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useSelector, useDispatch } from "react-redux";
import { searchFilter } from '@/Redux/search/search';
import Switch from '@/components/Toggle';
import Image from 'next/image';

const Featured = () => {
    const darker = useSelector(state => state.dark.mode)
     const { isSignedIn } = useAuth()
    const router = useRouter()
    const [userEx, setuserEx] = useState([])
    const [notifyModal, setnotifyModal] = useState(false)
    const [notifyPanel, setnotifyPanel] = useState([])
    const dispatch = useDispatch()
    let params = useParams()
    const [exercise, setexercise] = useState([])
    const { user, isLoaded } = useUser()
    const [text, settext] = useState('')
    const userName = user?.primaryEmailAddress?.emailAddress
    const searchedQuery = (text) => {
        dispatch(searchFilter(text))
        router.push(`/User/Exercises`)

    }
    const notifications = () => {
        setnotifyModal(!notifyModal)
    }
    useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])

    useEffect(() => {
        const fetcher = async () => {
            let search = params.slug
            try {
                const newData = await fetch(`https://exercisedb-api.vercel.app/api/v1/exercises?offset=20&limit=10&search=${search}&sortBy=targetMuscles&sortOrder=desc`)
                const res = await newData.json()
                console.log(res)    
                setexercise(res?.data)
            } catch (error) {
                console.log('Found Error')
            }

        }
        fetcher()
    }, [])

    return (
        <div>
            <div className={`flex justify-between items-center w-full fixed px-6 z-50 bg-${darker ? 'white' : 'black'}  p-3`}>
                <span className="flex top-5 left-5 gap-3">
                    
                    <Dumbbell className='text-amber-400' />
                    <h1 className={`text-xl font-bold text-${darker ? 'black' : 'white'}`}>MoveMaker</h1>

                </span>
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/User/Dashboard" className={`${darker ? 'text-black hover:text-gray-700' : 'text-gray-200 hover:text-white'}`}>Dashboard</Link>
                    <Link href="/User/Workouts" className={`${darker ? 'text-black hover:text-gray-700' : 'text-gray-200 hover:text-white'}`}>Explore Workouts</Link>
                    <Link href="/User/Exercises" className={`${darker ? 'text-black hover:text-gray-700' : 'text-gray-200 hover:text-white'}`}>Exercises</Link>
                </div>
                <div className="hidden md:flex gap-3 items-center w-1/3">
                    <input
                        type="text"
                        placeholder="Search an exercise..."
                        value={text}
                        className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none
  ${darker
                                ? 'bg-white text-black border-gray-300'
                                : 'bg-gray-900 text-white border-gray-700 placeholder-gray-400'}`}
                        onChange={(e) => settext(e.target.value)}

                    />
                    <SearchIcon className='text-orange-400 cursor-pointer' onClick={() => searchedQuery(text)} />
                        



                </div>
               
                <div>
                    {notifyPanel.length === 0 ? <Bell className='text-orange-400 hover:text-orange-600 cursor-pointer hidden md:block' onClick={notifications} /> : <BellDotIcon className='text-orange-400 hover:text-orange-600 cursor-pointer hidden md:block' onClick={notifications} />}

                </div>
                {userEx?.plan === 'premium' && <div className='flex'>
                <Switch />
                </div>}
                <div className='flex items-center gap-3'>
                    <h1 className={`${darker ? 'text-black' : 'text-white'} hidden md:block`}>{user?.primaryEmailAddress?.emailAddress}</h1>
                    <span className='text-white p-2 bg-orange-400 rounded-full w-10 text-center'>{userName?.[0]?.toUpperCase()}</span>
                    <SignOutButton className='bg-orange-400 p-2 rounded-2xl font-bold' routing="hash" redirectUrl="/">Sign out</SignOutButton>
                </div>

            </div>

            <div className="max-w-6xl mx-auto py-20">
                <h1 className="md:text-4xl font-extrabold text-gray-800 tracking-tight mt-10 px-5 text-2xl">
                    {params?.slug.toUpperCase()} Exercise Library
                </h1>
                <p className="text-gray-600 md:mt-1 pt-5 px-5">
                    Learn proper technique, target specific muscles, and explore exercises.
                </p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5">

                {/* ==== CARD === */}
                {Array.isArray(exercise) && exercise?.map((i) => (
                    <div
                        key={i.exerciseId}
                        className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                        {/* Thumbnail */}
                        <div className="h-48 w-full rounded-t-2xl overflow-hidden">
                            <Image
                                src={i?.gifUrl}
                                alt="exercise"
                                height={48}
                                width={48}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Title */}
                            <h2 className="text-xl font-semibold text-gray-800">{i?.name.toUpperCase()}</h2>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full font-medium">
                                    {i?.targetMuscles?.[0]}
                                </span>
                                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {i?.secondaryMuscles?.[1]}
                                </span>
                                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
                                    {i?.secondaryMuscles?.[0]}
                                </span>
                            </div>

                            {/* Learn More */}
                            <button className="mt-2 w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition" onClick={() => { getSingleExercise(i?.exerciseId), setmodal(true) }}>
                                Learn Technique →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Featured
