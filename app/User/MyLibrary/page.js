'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { Bell, BellDotIcon, Dumbbell, SearchIcon } from "lucide-react";
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { searchFilter } from '@/Redux/search/search';
import { useSelector } from 'react-redux'
import Switch from '@/components/Toggle';
import Spin from '@/components/Spin';
import { useAuth } from '@clerk/nextjs';
const MyLibrary = () => {
    
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const darker = useSelector(state => state.dark.mode)
    const [notifyPanel, setnotifyPanel] = useState([])
    const dispatch = useDispatch()
    const [saved, setSaved] = useState([])
    const [loading, setloading] = useState(false)
    const [search, setsearch] = useState('')
    const [text, settext] = useState('')
    const [userEx, setuserEx] = useState([])
    const [info, setInfo] = useState({})
     const { userId, isSignedIn } = useAuth()
    const userName = user?.primaryEmailAddress?.emailAddress
    useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])
    const searchedQuery = (text) => {
            dispatch(searchFilter(text))
                    router.push(`/User/Exercises`)
    
        }
        const notifications = () => {
        setnotifyModal(!notifyModal)
        // console.log('Hey')
        }
    useEffect(() => {
        if (!isLoaded && !user) return
        const libWork = async () => {
            setloading(true)
            try {
                let obj = {
                    userID: user.id
                }
                const data = await fetch('/api/myLibWork', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Set the content type to JSON
                    },
                    body: JSON.stringify(obj),
                })
                const res = await data.json()
                setSaved(res?.getWorkout)
                setloading(false)
            } catch (error) {
                console.log('Got some error in fetching the data check the console for more info')
            }
        }
        libWork()
    }, [isLoaded, user])

    const typeSearch = async (search) => {
         setloading(true)
        let obj = {
            type : search
        }
        try {
            const data = await fetch('/api/filterSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj),
            })
            const res = await data.json()
                setSaved(res?.getWorkout)
                setloading(false)
        } catch (error) {
            console.log('Got some error in fetching the data check the console for more info')
        }
    }


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
            <div className=" text-center pt-25">
                <h1 className="text-3xl font-bold text-gray-900">Let’s Get Moving 💪</h1>
                <p className="text-gray-500 mt-1">
                    Here are your saved workouts. Stay consistent, keep building.
                </p>
            </div>
            <div className="flex gap-3 items-center w-1/3 relative left-10 pt-10">
                <input
                    type="text"
                    placeholder="Search an exercise type..."
                     value={search}
                    className="md:w-full px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    onChange={(e) => setsearch(e.target.value)}


                />
                <SearchIcon className='text-orange-400 cursor-pointer hover:text-orange-500' onClick={() => typeSearch(search)} />

            </div>

            {loading ? (<Spin />) : (saved.length === 0 ? (<div className='flex justify-center items-center gap-5 flex-col h-[50vh]'><p className='text-xl font-bold font-mono'>No workouts created yet!</p><button className='bg-orange-400 p-2 rounded-2xl'>Create Now!</button></div>) : (<div className='grid md:grid-cols-2 gap-5 px-10'>

                {Array.isArray(saved) && saved?.map(item => {
                    return (
                        <div className=" w-full mx-auto bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 mt-10" key={item?._id}>
                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{item.name}</h2>
                            <p className="text-gray-500 mb-4">{item?.desc}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                    {item?.type}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                                    {item?.difficulty}
                                </span>
                            </div>

                            {/* Exercise Info Section */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Exercise</span>
                                    <span className="font-semibold text-gray-700">{item?.exerName}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Duration</span>
                                    <span className="font-semibold text-gray-700">{item.mins} min</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Sets</span>
                                    <span className="font-semibold text-gray-700">{item.sets}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Reps</span>
                                    <span className="font-semibold text-gray-700">{item.reps}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Rest</span>
                                    <span className="font-semibold text-gray-700">{item.rest} sec</span>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>))}
        </div>
    )
}

export default MyLibrary
