'use client'
import Navbar from '@/components/Navbar'
import { SearchIcon } from 'lucide-react'
import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
const Workouts = () => {
  const darker = useSelector(state => state.dark.mode)
  const [workout, setworkout] = useState([])
  const router = useRouter()
  let { isLoaded } = useUser()
  const [search, setSearch] = useState('')
  const { isSignedIn } = useAuth()
  useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])
  useEffect(() => {
    const fetcher = async () => {
      const data = await fetch('/api/allworkout')
      const res = await data.json()
      console.log(res?.getWorkout)
      setworkout(res?.getWorkout)
    }
    fetcher()
  }, [])



  const filterWorkout = async (item) => {
    let obj = {
      slug: item
    }
    const getfilWork = await fetch('/api/fillworkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type
      },
      body: JSON.stringify(obj)
    })
    const res = await getfilWork.json()
    
    setworkout(res?.getWorkout)
  }

  const searchWorkout = async (item) => {
    let obj = {
      slug: item
    }
    console.log(obj)
    const getfilWork = await fetch('/api/fillworkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type
      },
      body: JSON.stringify(obj)
    })
    const res = await getfilWork.json()

    setworkout(res?.getWorkout)
  }
  const filters = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core"];
  return (
    <div>
      <Navbar />
      <div className={`min-h-screen w-full p-6
${darker 
  ? 'bg-gradient-to-b from-gray-50 to-white text-black' 
  : 'bg-gradient-to-b from-black to-gray-900 text-white'}`}>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold 
${darker ? 'text-gray-800' : 'text-white'}`}>Workouts</h1>
          <p  className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Browse all workouts or filter by category.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

          {/* Search */}
          <div className='flex justify-center items-center gap-5'>
            <input
              placeholder="Search workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400
  ${darker 
    ? 'bg-white text-black border border-gray-300' 
    : 'bg-gray-900 text-white border border-gray-700 placeholder-gray-400'}`}

            />
            <SearchIcon className={`${darker ? 'text-gray-600' : 'text-gray-300'} hover:text-orange-400 cursor-pointer`} onClick={() => searchWorkout(search)} />

          </div>


          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map((f, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full shadow-sm transition font-medium
  ${darker 
    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'
    : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white'}`}
                onClick={() => filterWorkout(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {Array.isArray(workout) && workout.map((item) => (
            <div
              key={item?._id}
              className={`border shadow-sm rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer
  ${darker 
    ? 'bg-white border-gray-200 text-black'
    : 'bg-gray-900 border-gray-700 text-white'}`}
            >
              

              <h2 className={`text-xl font-semibold 
${darker ? 'text-gray-800' : 'text-white'}`}>Workout {item?.name}</h2>
              <p className={`${darker ? 'text-gray-500' : 'text-gray-400'} text-sm mt-1`}>{item?.category}</p>

              <div className="flex gap-3 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs
${darker 
  ? 'bg-gray-100 text-gray-700'
  : 'bg-gray-800 text-gray-300'}`}>
                  Strength
                </span>
                <span className={`px-3 py-1 rounded-full text-xs
${darker 
  ? 'bg-gray-100 text-gray-700'
  : 'bg-gray-800 text-gray-300'}`}>
                  {item?.difficulty}
                </span>
              </div>

              <Link href={`/User/Workouts/workout/${item._id}`}><button className="w-full mt-4 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
                View Workout
              </button></Link>
            </div>
          ))}

        </div>

      </div>
      <footer  className={`px-6 md:px-20 py-6 text-sm flex justify-between border-t
${darker 
  ? 'border-gray-200 text-gray-700'
  : 'border-gray-700 text-gray-400'}`}>
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

export default Workouts
