'use client'
import React from 'react'
import { Dumbbell, SearchIcon } from "lucide-react";
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
const Tasks = () => {
    const [tasks, settasks] = useState([])
    const [mark, setmark] = useState(false)
    const [marked, setmarked] = useState([])
    let { user } = useUser()
    const [panel, setPanel] = useState([])
    useEffect(() => {
        const fetcher = async () => {
            try {
                const data = await fetch('/api/gettasks')
                const res = await data.json()
                settasks(res?.tasking)
            }
            catch (error) {
                console.log('Unable to fetch tasks')
            }
            if (user?.id) {
                const userInfo = { userID: user?.id }
                const data = await fetch('/api/marker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Set the content type to JSON
                    },
                    body: JSON.stringify(userInfo),
                })
                const res = await data.json()
                setmarked(res?.notification?.filter(n => n.comp).map(n => n?.id))
                

            }
        }
        fetcher()
    }, [user?.id])
   
    const markCompleted = async (item, msg) => {
        let obj = {
            comp: true,
            id: item?._id,
        }
        const data = await fetch('/api/markComplete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })
        setmarked(prev => [...prev, item.id])
        let systemNotify = {
      userID: user?.id,
      message: msg
    }
    const notify = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify(systemNotify),
    })

    const id = Date.now()

        setPanel(prev=>[...prev, {id, msg}])
        setTimeout(() => {
            setPanel(prev=>prev.filter(i=> i.id !== id))
        }, 4000);


  }
  const closeBadge = (id) => {
    setPanel(prev=>prev.filter(i=> i.id !== id))
  }

    
    return (
        <>
            <div className='flex justify-between items-center w-full fixed px-10 z-50 bg-black  p-3'>
                <span className="flex top-5 left-5 gap-3">
                    <Dumbbell className='text-amber-400' />
                    <h1 className="text-xl font-bold text-white">MoveMaker</h1>

                </span>
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/User/Dashboard" className="text-gray-200 hover:text-white">Dashboard</Link>
                    <Link href="/User/Workouts" className="text-gray-200 hover:text-white">My Workouts</Link>
                    <Link href="/User/Exercises" className="text-gray-200 hover:text-white">Exercises</Link>
                </div>
                <div className="flex gap-3 items-center w-1/3">
                    <input
                        type="text"
                        placeholder="Search an exercise..."

                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"


                    />
                    <SearchIcon className='text-orange-400 cursor-pointer hover:text-orange-500' />



                </div>
                <div className='flex items-center gap-3'>

                    <SignOutButton className='bg-orange-400 p-2 rounded-2xl font-bold' routing="hash" redirectUrl="/">Sign out</SignOutButton>
                </div>

            </div>
            <div className='pt-20'>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mt-5">
                    💫Daily Challenges
                </h2>
                <div className='flex flex-col gap-5 justify-center items-center'>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                        Complete small, meaningful tasks every day.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Build momentum, earn coins, and stay consistent.
                    </p>
                </div>
                <div className='grid grid-cols-2 gap-10 px-5 pt-10'>
                    {Array?.isArray(tasks) && tasks?.map(item => {
                        return (
                            <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm border 
      bg-white dark:bg-neutral-900 dark:border-neutral-700 transition-all`} key={item?._id}>

                                {/* Left side */}
                                <div className="flex items-center gap-3">

                                    {/* Checkbox icon */}
                                    <button

                                        className="text-green-500 bg-orange-50 rounded-2xl p-2"
                                        onClick={() => markCompleted(item, `Yeah! You comppleted a daily task. Here is your reward 🪙${item?.coins}`)}
                                    >
                                        {marked.includes(item?.id) ? <p>Comp</p> : <p>Comple</p>}
                                    </button>

                                    {/* Task Text */}
                                    <div>
                                        <p className='font-semibold text-[15px]' >
                                            {item.task}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.coins} coins
                                        </p>
                                    </div>
                                </div>

                                {/* Right side reward badge */}
                                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 
        dark:bg-yellow-900 dark:text-yellow-300 text-sm font-medium">
                                    +{item.coins}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
             <div className='fixed top-4 right-4 flex flex-col z-50 space-y-4 mt-20'>
                {Array.isArray(panel) && panel?.map(item=>{
                    return (
                        <div className='w-full p-4 rounded-2xl bg-black/80 backdrop-blur-2xl h-[40%] text-white flex justify-between gap-5' key={item?.id}>
                            <h1>{item?.msg}</h1>
                            <span onClick={()=>closeBadge(item?.id)}>x</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Tasks
