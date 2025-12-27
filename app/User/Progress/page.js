'use client'
import React from 'react'
import { SignOutButton } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
const Progress = () => {
    const darker = useSelector(state => state.dark.mode)

    let { user, isLoaded } = useUser()
    const [saved, setSaved] = useState([])
    const [target, settarget] = useState([])
    
    useEffect(() => {
        if (!isLoaded || !user) return
        const libWork = async () => {
            try {
                let obj = { userID: user?.id }
                const data = await fetch('/api/recenthistory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj),
                })
                const res = await data.json()
                setSaved(res?.getWorkout)

                const extractedTargets =
                    res?.getWorkout?.map(w => w.targetMuscles)?.flat() || []
                settarget(extractedTargets)
            } catch (error) {
                console.log('Error fetching data')
            }
        }
        libWork()
    }, [isLoaded, user])

     const favorite = useMemo(() => {
    if (!target?.length) return ""

    const freq = {}
    for (const muscle of target) {
      freq[muscle] = (freq[muscle] || 0) + 1
    }

    return Object.keys(freq).find(key => freq[key] > 1) || ""
  }, [target])

   const streak = useMemo(() => {
  if (!saved.length) return 0

  const today = new Date()
  const lastWorkoutDate = new Date(saved[0]?.date)

  today.setHours(0, 0, 0, 0)
  lastWorkoutDate.setHours(0, 0, 0, 0)

  const diffInTime = today - lastWorkoutDate
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24)

  if (diffInDays === 1) return 1
  if (diffInDays > 1) return 0
  return 0
}, [saved])

    return (
        <div>
            <Navbar />

            <div
                className={`w-full min-h-screen p-5
                ${darker ? 'bg-gray-50 text-black' : 'bg-black text-white'}`}
            >
                {/* Top Section */}
                <div className="mb-8">
                    <p className={`${darker ? 'text-gray-600' : 'text-gray-400'}`}>
                        Track your workouts, monitor progress, and stay consistent.
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[{
                        title: 'Current Streak',
                        value: `${streak} ${streak === 1 ? 'Day' : 'Days'}`
                    }, {
                        title: 'Best Streak',
                        value: '7 Days'
                    }, {
                        title: 'Workouts Completed',
                        value: saved.length
                    }, {
                        title: 'This Week',
                        value: `${saved.length} Workouts`
                    }].map((card, i) => (
                        <div
                            key={i}
                            className={`p-5 rounded-2xl border shadow-sm
                            ${darker ? 'bg-white border-gray-100' : 'bg-gray-900 border-gray-700'}`}
                        >
                            <h2 className={`text-sm font-medium mb-1
                                ${darker ? 'text-gray-500' : 'text-gray-400'}`}>
                                {card.title}
                            </h2>
                            <p className={`text-3xl font-semibold
                                ${darker ? 'text-gray-800' : 'text-white'}`}>
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[
                        { title: 'Most Trained Muscle', value: favorite },
                        { title: 'Favorite Exercise', value: 'Cable Palm Rotational Row' },
                        { title: 'PRs Achieved', value: '3' }
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`p-5 rounded-2xl border shadow-sm
                            ${darker ? 'bg-white border-gray-100' : 'bg-gray-900 border-gray-700'}`}
                        >
                            <h2 className={`text-sm font-medium mb-1
                                ${darker ? 'text-gray-500' : 'text-gray-400'}`}>
                                {card.title}
                            </h2>
                            <p className={`text-2xl font-semibold
                                ${darker ? 'text-gray-800' : 'text-white'}`}>
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Recent Workouts */}
                <div
                    className={`mt-10 p-6 rounded-2xl border shadow-sm
                    ${darker ? 'bg-white border-gray-100' : 'bg-gray-900 border-gray-700'}`}
                >
                    <h2 className={`text-xl font-semibold mb-4
                        ${darker ? 'text-gray-800' : 'text-white'}`}>
                        Recent Workouts
                    </h2>

                    <ul className="space-y-3 text-sm">
                        {saved?.slice(0, 3).map((item, i) => (
                            <li
                                key={i}
                                className={`p-3 rounded-xl
                                ${darker ? 'bg-gray-50 text-gray-700' : 'bg-gray-800 text-gray-300'}`}
                            >
                                {item?.name?.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Today's Workout */}
                <div
                    className={`mt-10 p-6 rounded-2xl border shadow-sm
                    ${darker ? 'bg-white border-gray-100' : 'bg-gray-900 border-gray-700'}`}
                >
                    <h2 className={`text-xl font-semibold mb-4
                        ${darker ? 'text-gray-800' : 'text-white'}`}>
                        Current Day Workout
                    </h2>

                    {[
                        'Bench Press',
                        'Incline Dumbbell Press',
                        'Cable Fly'
                    ].map((ex, i) => (
                        <div
                            key={i}
                            className={`flex justify-between p-4 rounded-xl mb-2
                            ${darker ? 'bg-gray-50 text-gray-700' : 'bg-gray-800 text-gray-300'}`}
                        >
                            <span className="font-medium">{ex}</span>
                            <span className="text-sm">3 to 4 sets</span>
                        </div>
                    ))}

                    <Link href="/User/Workouts">
                        <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition">
                            Start Workout
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer
                className={`px-6 md:px-20 py-6 border-t text-sm flex justify-between
                ${darker ? 'border-gray-200 text-gray-700' : 'border-gray-700 text-gray-400'}`}
            >
                <p>© {new Date().getFullYear()} MoveMaker. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#">GitHub</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </footer>
        </div>
    )
}

export default Progress
