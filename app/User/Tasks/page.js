'use client'
import React from 'react'
import {  Bell, BellDotIcon, Dumbbell, SearchIcon } from "lucide-react";
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/nextjs';
import Switch from '@/components/Toggle';
const Tasks = () => {
    const [tasks, settasks] = useState([])
     const { isSignedIn } = useAuth()
    const [marked, setmarked] = useState([])
    let { user, isLoaded } = useUser()
    const [panel, setPanel] = useState([])
    const ref = useRef(0)
     const router = useRouter()
        const darker = useSelector(state => state.dark.mode)
        const [notifyPanel, setnotifyPanel] = useState([])
        const [loading, setloading] = useState(false)
        const [search, setsearch] = useState('')
        const [text, settext] = useState('')
        const [userEx, setuserEx] = useState([])
        const [info, setInfo] = useState({})
        const userName = user?.primaryEmailAddress?.emailAddress
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
        setmarked(prev => [...prev, item._id])
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

    ref.current +=1
    const id = ref.current

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
                <div className='grid md:grid-cols-2 gap-10 px-5 pt-10'>
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
