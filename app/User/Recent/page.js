'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { Dumbbell, SearchIcon, Bell } from "lucide-react"
import Link from 'next/link'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { useDispatch, useSelector } from "react-redux"
import { searchFilter } from "@/Redux/search/search"
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'
import Switch from '@/components/Toggle'
import { useAuth } from '@clerk/nextjs';
const Recent = () => {
    const darker = useSelector(state => state.dark.mode)
     const { isSignedIn } = useAuth()
    const router = useRouter()
    const dispatch = useDispatch()

    const [text, settext] = useState('')
    let { user, isLoaded } = useUser()
    const [notifyModal, setnotifyModal] = useState(false)
    const [notifyPanel, setnotifyPanel] = useState([])
    const [historical, setHistorical] = useState([])
    const [loading, setloading] = useState(false)

    const notifications = () => {
        setnotifyModal(!notifyModal)
    }

    const searchedQuery = (text) => {
        dispatch(searchFilter(text))
        router.push(`/User/Exercises`)
    }
    useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])
    useEffect(() => {
        const fetched = async () => {
            setloading(true)
            let obj = { userID: user?.id }
            try {
                const data = await fetch('/api/recenthistory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj),
                })
                const res = await data.json()
                setHistorical(res?.getWorkout)
                setloading(false)
            } catch (error) {
                console.log('Could not find the recent activities')
                setloading(false)
            }
        }
        fetched()
    }, [])

    return (
        <div>
            {/* Top Bar */}
            <div
                className={`flex justify-between items-center w-full fixed px-6 z-50 p-3
                ${darker ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
                <span className="flex gap-3">
                    <Dumbbell className="text-orange-400" />
                    <h1 className="text-xl font-bold">MoveMaker</h1>
                </span>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/User/Dashboard" className="hover:opacity-80">Dashboard</Link>
                    <Link href="/User/Workouts" className="hover:opacity-80">Explore Workouts</Link>
                    <Link href="/User/Exercises" className="hover:opacity-80">Exercises</Link>
                </div>

                <div className="flex gap-3 items-center w-1/3">
                    <input
                        type="text"
                        placeholder="Search an exercise..."
                        value={text}
                        onChange={(e) => settext(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none
                        ${darker
                            ? 'bg-white text-black border border-gray-300'
                            : 'bg-gray-900 text-white border border-gray-700 placeholder-gray-400'}`}
                    />
                    <SearchIcon
                        className="text-orange-400 cursor-pointer"
                        onClick={() => searchedQuery(text)}
                    />
                </div>

                <Bell
                    className="text-orange-400 hover:text-orange-600 cursor-pointer"
                    onClick={notifications}
                />

                <Switch />

                <div className="flex items-center gap-3">
                    <h1 className={`${darker ? 'text-black' : 'text-white'}`}>
                        {user?.primaryEmailAddress?.emailAddress}
                    </h1>
                    <SignOutButton
                        className="bg-orange-400 p-2 rounded-2xl font-bold text-black"
                        routing="hash"
                        redirectUrl="/"
                    >
                        Sign out
                    </SignOutButton>
                </div>
            </div>

            {/* Notification Panel */}
            {notifyModal && (
                <div
                    className={`fixed z-50 w-1/4 h-[40%] right-20 top-20 rounded-2xl overflow-y-auto backdrop-blur-2xl
                    ${darker ? 'bg-white' : 'bg-black/80'}`}
                >
                    <div className="flex justify-between px-10 items-center">
                        <h1 className={`mt-2 text-xl font-bold
                            ${darker ? 'text-black' : 'text-white'}`}>
                            Notifications
                        </h1>
                        <span
                            className="text-orange-400 cursor-pointer hover:text-orange-600"
                            onClick={notifications}
                        >
                            Close
                        </span>
                    </div>
                    <hr className={`${darker ? 'border-gray-300' : 'border-gray-700'} mt-2`} />
                    <p className={`text-center mt-5
                        ${darker ? 'text-gray-600' : 'text-white'}`}>
                        No new notifications
                    </p>
                </div>
            )}

            {/* Content */}
            <div className="pt-28">
                <h1 className={`text-5xl ml-10
                    ${darker ? 'text-white' : 'text-white'}`}>
                    Recent Activity
                </h1>

                {loading ? (
                    <Spinner />
                ) : historical.length === 0 ? (
                    <p className={`text-xl mt-10 text-center font-mono
                        ${darker ? 'text-gray-500' : 'text-gray-400'}`}>
                        No recent activity
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-10 px-20 pt-10">
                        {historical.map(item => (
                            <div
                                key={item?._id}
                                className={`w-full p-6 rounded-2xl border shadow-md hover:shadow-lg transition
                                ${darker
                                    ? 'bg-white border-gray-100 text-black'
                                    : 'bg-gray-900 border-gray-700 text-white'}`}
                            >
                                <h2 className="text-2xl font-bold mb-3 capitalize">
                                    {item.name}
                                </h2>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-orange-500 mb-1">
                                        Target Muscle
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item?.targetMuscles?.map((muscle, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 text-sm rounded-full
                                                ${darker
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-orange-900/30 text-orange-300'}`}
                                            >
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-sm font-semibold mb-1
                                        ${darker ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Secondary Muscles
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item?.secondaryMuscles?.map((muscle, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 text-sm rounded-full
                                                ${darker
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-gray-800 text-gray-300'}`}
                                            >
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Recent
