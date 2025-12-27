'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, BellDotIcon, Dumbbell, SearchIcon,  } from "lucide-react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { searchFilter } from "@/Redux/search/search";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux'
import Switch from './Toggle';
const Navbar = () => {
    const darker = useSelector(state => state.dark.mode)
    const router = useRouter()
    const [text, settext] = useState('')
    const [userEx, setuserEx] = useState([])
    let { user } = useUser()
    const dispatch = useDispatch()
    const [notifyModal, setnotifyModal] = useState(false)
    const [notifyPanel, setnotifyPanel] = useState([])
    const [coin, setCoin] = useState([]);
    const [info, setInfo] = useState([])
    const [details, setDetails] = useState({
            feet: '',
            inches: '',
            weight: '',
            level: '',
            goal: '',
        })
    const notifications = () => {
        setnotifyModal(!notifyModal)
        // console.log('Hey')
    }
    const searchedQuery = (text) => {
        dispatch(searchFilter(text))
        router.push(`/User/Exercises`)
        console.log(text)

    }
    useEffect(() => {
        if (!isLoaded || !user) return null;
        const fetching = async () => {
            try {
                const userInfo = { userID: user?.id }
                const data = await fetch('/api/marker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Set the content type to JSON
                    },
                    body: JSON.stringify(userInfo),
                })
                const res = await data.json()
                console.log(res)
                setCoin(res?.notification?.filter(n => n.comp).map(n => n.coins))

            } catch (error) {
                console.log('Fetching coins were impossible...')
            }

        }
        fetching()
    }, [user?.id])


    useEffect(() => {
  if (info) {
    setDetails({
      feet: info.feet || "",
      inches: info.inches || "",
      weight: info.weight || "",
      level: info.level || "",
      goal: info.goal || "",
    });
  }
}, [info]);

    useEffect(() => {
        const fetcher = async () => {
            const data = await fetch('/api/extra')
            const res = await data.json()
            console.log(res?.getWorkout[0])
            setuserEx(res?.getWorkout[0])
        }
        fetcher()
    }, [])

    let pathName = usePathname()
    
    useEffect(() => {
        const fetcher = async () => {
            let obj = {
                userID: user?.id
            }
            const data = await fetch('/api/getNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj),
            })
            const res = await data.json()
            console.log(res?.notification)
            setnotifyPanel(res?.notification)
        }
        fetcher()
    }, [user?.id])

    const removeNotification = async (id) => {
        let obj = {
            userID: user?.id,

        }
        const data = await fetch('/api/delnotify', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })
        setnotifyPanel(prev => prev.filter(i => i._id !== id))
    }
    const userName = user?.primaryEmailAddress?.emailAddress
    let menu = ['Dashboard', 'Workouts', 'Exercises', 'Progress', 'Profile']
     
    return (
        <div>
            <video src="https://www.pexels.com/download/video/6390166/" className='absolute inset-0 w-full h-[60vh] object-cover pt-15' playsInline loop autoPlay muted></video>

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
                    {info?.image ?  <span className=' text-center'><img src={info?.image}/></span> :  <span className='text-white p-2 bg-orange-400 rounded-full w-10 text-center'>{userName?.[0]?.toUpperCase()}</span>}
                    <SignOutButton className='bg-orange-400 p-2 rounded-2xl font-bold' routing="hash" redirectUrl="/">Sign out</SignOutButton>
                </div>

            </div>
            {notifyModal && <div className={`fixed z-50 w-1/4 h-[40%] right-20 top-20 rounded-2xl overflow-y-auto backdrop-blur-2xl
${darker ? 'bg-white text-black' : 'bg-black/80 text-white'}`}>
                <div className='flex justify-between px-10 items-center'>
                    <h1 className={`text-center mt-2 text-xl font-bold font-mono 
${darker ? 'text-black' : 'text-white'}`}>Notifications</h1>
                    <span className='text-orange-400 cursor-pointer hover:text-orange-600' onClick={notifications}>Close</span>
                </div>
                <hr className='text-white mt-2' />
                <div>
                    {notifyPanel?.length === 0 ? <p className='text-center text-white mt-5'>No new notifications</p> : Array.isArray(notifyPanel) && notifyPanel?.map(item => {
                        return (
                            <div key={item?._id} >
                                <div className='mt-6 ml-2 px-5 flex justify-between'>
                                    <h1 className='text-white font-serif'>{item?.message}</h1>
                                    <span className='text-orange-400 cursor-pointer hover:text-orange-400' onClick={() => removeNotification(item?._id)}>x</span>
                                </div>
                                <hr className='text-white mt-5' />
                            </div>
                        )
                    })}


                </div>

            </div>}

            <div className='absolute z-40 mt-30'>
                <p className='md:text-4xl text-white md:px-30 text-2xl px-10 font-mono'>Build the body you have always imagined—one rep, one set, one disciplined day at a time.
                    Push your limits, fuel your growth, and watch strength turn into unstoppable confidence.</p>

                    <div className="flex md:hidden gap-3 items-center w-full px-10 mt-3">
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
            </div>

            <div className='flex justify-center items-center'>
                
                <div className={`backdrop-blur-2xl md:w-1/2 text-lg flex gap-5 justify-between items-center md:my-20 p-4 rounded-2xl relative md:mt-80 mt-120 w-full overflow-x-auto
${darker ? 'bg-white/70 text-black' : 'bg-black/40 text-white'}`}>
                    {menu?.map((item, index) => {
                        let path = `/User/${item}`
                        let active = path === pathName
                        return (
                            <div key={index} className='relative'>
                                <Link href={path}>
                                    <button className='relative text-md font-sans font-bold hover:text-blue-400 cursor-pointer'>{active && (
                                        <motion.div
                                            layoutId="active"
                                            className={`absolute inset-0 bg-orange-400 rounded-md w-full`}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                        <span className={`relative z-10 ${darker ? 'text-black' : 'text-white'}`}>{item}</span>
                                    </button>
                                </Link>
                            </div>
                        )
                    })}

                </div>
                
            </div>

        </div>


    )
}

export default Navbar
