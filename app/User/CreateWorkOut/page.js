'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Dumbbell } from "lucide-react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { SearchIcon } from 'lucide-react';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation'

const CreateWorkout = () => {
    const {user} = useUser()
    const [exerModal, setExerModal] = useState(false)
    const [exer, setExer] = useState([])
    const [loading, setloading] = useState(false)
    const [count, setcount] = useState(0)
    const router = useRouter()
    const [marked, setmarked] = useState(false)
    const [panel, setPanel] = useState([])
    const badgeImg = 'https://cdn-icons-png.flaticon.com/128/11297/11297546.png'
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
    router.push('/User/Confirmation')
  }
    const closeBadge = () => {
    setmarked(false)
  }
    const [exerInfo, setexerInfo] = useState({
        name: '',
        desc: '',
        type: '',
        difficulty: '',
        exerName: '',
        mins: 0,
        sets: 0,
        reps: 0,
        rest: 0,
        notes: '',
        userID : ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setexerInfo(prev => ({ ...prev, [name]: value }))
    }
    const open = () => {
        setExerModal(true)
    }
    const close = () => {
        setExerModal(false)
    }
    const addExercise = (details) => {
        setExer(prev => [...prev, details])
        setExerModal(false)
    }
    const saveWorkOut = async (msg) => {
        try {
            setloading(true)
            let obj = {
                name: exerInfo.name,
                desc: exerInfo.desc,
                type: exerInfo.type,
                difficulty: exerInfo.difficulty,
                exerName: exerInfo.exerName,
                mins: exerInfo.mins,
                sets: exerInfo.sets,
                reps: exerInfo.reps,
                rest: exerInfo.rest,
                notes: exerInfo.notes,
                userID : user.id
            }
            const storeData = await fetch('/api/newWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj),  
            })

            const allWork = await fetch('/api/mylib')
            const res = await allWork.json()
            console.log(res?.getWork?.length)
            setcount(res?.getWork?.length)
            if(res?.getWork?.length === 5){
                setmarked(true)
            }
            // else{
                let systemNotify = {
                userID : user?.id,
                message : 'You just created a new workout!💪'
               }
               const notify = await fetch('/api/notifications', {method : 'POST',
                headers: {
                        'Content-Type': 'application/json' // Set the content type to JSON
                    },
                    body: JSON.stringify(systemNotify),
               }) 
               router.push('/User/Confirmation')
               
            // }
            
            
        } catch (error) {
            console.log('Found error check the console for more info')
        }

        const id = Date.now()

        setPanel(prev=>[...prev, {id, msg}])
        setTimeout(() => {
            setPanel(prev=>prev.filter(i=> i.id !== id))
        }, 4000);
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
                    <h1 className='text-white'>{user?.primaryEmailAddress?.emailAddress}</h1>
                    <SignOutButton className='bg-orange-400 p-2 rounded-2xl font-bold' routing="hash" redirectUrl="/">Sign out</SignOutButton>
                </div>
            </div>
            {exerModal && <div className='fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl'>
                <div className='bg-white w-1/2 rounded-2xl shadow-lg p-5'>
                    <div className="flex items-center justify-between">
                        <h4 className="text-xl font-semibold">Add an Exercise</h4>
                        <span className="text-md text-gray-600 font-semibold hover:text-black cursor-pointer" onClick={close}>X</span>
                    </div>

                    {/* Inputs */}
                    <div className='mt-5'>
                        <input type="text" placeholder='Type an Exercise.....' className="px-3 py-2 bg-gray-50 border rounded-xl w-full" value={exerInfo.exerName} name='exerName' onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <input
                            type="number"
                            placeholder="Sets"
                            className="px-3 py-2 bg-gray-50 border rounded-xl"
                            value={exerInfo.sets}
                            name='sets'
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            placeholder="Reps"
                            className="px-3 py-2 bg-gray-50 border rounded-xl"
                            value={exerInfo.reps}
                            name='reps'
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            placeholder="Rest (sec)"
                            className="px-3 py-2 bg-gray-50 border rounded-xl"
                            value={exerInfo.rest}
                            name='rest'
                            onChange={handleChange}
                        />
                    </div>

                    {/* Optional notes area */}
                    <textarea
                        placeholder="Notes (optional)"
                        className="mt-4 w-full bg-gray-50 border px-3 py-2 rounded-xl"
                        rows="2"
                        value={exerInfo.notes}
                        name='notes'
                        onChange={handleChange}
                    />
                    <button className='bg-orange-400 font-bold p-2 rounded-2xl mt-5' onClick={() => addExercise(exerInfo)}>Add Exercise</button>
                </div>

            </div>}
            <div className='py-20 px-10 '>

                <div className='text-center flex justify-center items-center flex-col gap-3 mt-5'>
                    <h1 className='text-3xl font-extrabold'>🐦‍🔥Let is Build Your Perfect Workout</h1>
                    <p className='text-lg text-orange-400'>`Small habits. Big results. Start by giving your workout a name.</p>
                </div>
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-gray-900">Create Workout</h2>

                </div>

                {/* FORM */}
                <div className="space-y-3">

                    {/* Workout Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Workout Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={exerInfo.name}
                            name='name'
                            onChange={handleChange}
                            placeholder="e.g. Push Day, HIIT Blast"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-3 border rounded-xl bg-gray-50 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Short summary of the workout..."
                            value={exerInfo.desc}
                            name='desc'
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Type + Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Workout Type</label>
                            <select className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" value={exerInfo.type}
                                name='type'
                                onChange={handleChange}>
                                <option>Strength</option>
                                <option>Hypertrophy</option>
                                <option>Cardio</option>
                                <option>HIIT</option>
                                <option>Mobility</option>
                                <option>Full Body</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Difficulty</label>
                            <select className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" value={exerInfo.difficulty}
                                name='difficulty'
                                onChange={handleChange}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 45"
                            value={exerInfo.mins}
                            name='mins'
                            onChange={handleChange}
                        />
                    </div>

                    {/* Exercises List */}
                    <div className="bg-gray-50 border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800">Exercises</h3>
                            <button className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm" onClick={open}>
                                + Add Exercise
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Example exercise block */}
                            {Array.isArray(exer) && exer?.map((item, index) => {
                                return (
                                    <div className="p-3 border rounded-xl bg-white shadow-sm" key={index}>
                                        <h4 className="font-semibold">{item.exerName}</h4>
                                        <div className="grid grid-cols-3 gap-3 mt-2">
                                            <p className="text-md" >Sets: {item.sets}</p>
                                            <p className="text-md" >Reps: {item.reps}</p>
                                            <p className="text-md" >Rest: {item.rest} seconds</p>
                                        </div>
                                        <span className='flex gap-2 mt-2'>Note: <p className='text-md text-orange-500 font-bold'> {item.notes}</p></span>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Link href='/User/Dashboard'><button className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300">
                            Cancel
                        </button></Link>
                        <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={()=>saveWorkOut('You just created a new workout!💪')}>
                            Save Workout
                        </button>
                    </div>



                </div>

                {marked  && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className='absolute cursor-pointer text-orange-400 font-bold hover:text-orange-300' onClick={closeBadge}>X</div>
              {/* Badge Icon Placeholder */}
              <div className="w-24 h-24 mx-auto bg-yellow-300 rounded-full shadow-md flex items-center justify-center text-4xl font-bold">
                <img src='https://cdn-icons-png.flaticon.com/128/11297/11297546.png' alt="" />

              </div>


              <h2 className="text-xl font-semibold mt-4">Congratulations!</h2>
              <p className="text-gray-600 mt-2">
                You have earned a new badge
              </p>

              <div className="mt-3 text-lg font-medium text-orange-500">
                <span>Badge Type: </span>
                <span className="font-bold">Created 5 workouts</span>
              </div>

              <button className="mt-5 bg-orange-600 text-white w-full py-3 rounded-xl font-medium hover:bg-orange-500 transition-all" onClick={()=>addBadge(badgeImg)}>
                Add to Profile
              </button>
            </motion.div>
          </div>}
            </div>
            <div className='fixed top-4 right-4 flex flex-col z-50 space-y-4 mt-20'>
                {Array.isArray(panel) && panel?.map(item=>{
                    return (
                        <div className='w-full p-4 rounded-2xl bg-black/80 backdrop-blur-2xl h-[40%] text-white flex justify-between gap-5' key={item?.id}>
                            <h1>{item?.msg}</h1>
                            <span>x</span>
                        </div>
                    )
                })}
            </div>
        </>



    )
}

export default CreateWorkout
