
'use client'
import { SignOutButton } from '@clerk/nextjs';
import { Dumbbell, SearchIcon, Bell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';
import { searchFilter } from "@/Redux/search/search"
import Switch from '@/components/Toggle';
import { useSelector, useDispatch } from "react-redux";
export default function WorkoutDetailsPage() {
  let params = useParams()
  let { user } = useUser()
  const router = useRouter()
  const dispatch = useDispatch()
  const [notifyModal, setnotifyModal] = useState(false)
  const [notifyPanel, setnotifyPanel] = useState([])
  const darker = useSelector(state => state.dark.mode);
  const [text, settext] = useState('')
  const notifications = () => {
    setnotifyModal(!notifyModal)
    // console.log('Hey')
  }
  const [seeWorkout, setseeWorkout] = useState(null)
  const [panel, setPanel] = useState([])
  const [mark, setmark] = useState(false)
  const [marked, setmarked] = useState(false)
  const badgeImg = 'https://cdn-icons-png.flaticon.com/128/1616/1616456.png'
  const [allWorkout, setallWorkout] = useState([])
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
      const data = await fetch(`/api/oneworkout/${params?.id}`)
      const res = await data.json()
      setseeWorkout(res?.seeWorkout)
      if (user?.id) {
        const userInfo = { userID: user.id };
        const getWork = await fetch('/api/getonework', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userInfo),
        });
        const workRes = await getWork.json();
        setallWorkout(workRes?.oneWokout || []);
        const current = workRes?.oneWokout?.find(
          w => w.name === res?.seeWorkout?.name
        );
        setmark(current?.isMark || false);
        setmarked(false); // ensure modal is closed on refresh
      }

    }
    fetcher()
  }, [user?.id])
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
  const searchedQuery = (text) => {
    dispatch(searchFilter(text))
    router.push(`/User/Exercises`)
  }


  const markWorkout = async (seeWorkout, msg) => {
    setmark(true);

    // If this is the first workout, show badge immediately
    if (allWorkout.length === 0) {
      setmarked(true);
    }


    let obj = {
      userID: user?.id,
      name: seeWorkout?.name,
      description: seeWorkout?.description,
      isMark: true

    }
    const fetcher = await fetch('/api/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify(obj),
    })
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

    setPanel(prev => [...prev, { id, msg }])
    setTimeout(() => {
      setPanel(prev => prev.filter(i => i.id !== id))
    }, 4000);


  }
  const closeBadge = () => {
    setmarked(false)
  }

  return (
    <>

      <div className={`flex justify-between items-center w-full fixed px-6 z-50 p-3
                ${darker ? 'bg-white text-black' : 'bg-black text-white'}`}>
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
      {notifyModal && <div className='fixed z-50 w-1/4 bg-black/80 backdrop-blur-2xl h-[40%] right-20 top-20 rounded-2xl overflow-y-auto'>
        <div className='flex justify-between px-10 items-center'>
          <h1 className='text-white text-center mt-2 text-xl font-bold font-mono'>Notifications</h1>
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

      <div className={`min-h-screen p-6 pt-24
${darker
          ? 'bg-gradient-to-b from-white to-gray-50 text-black'
          : 'bg-gradient-to-b from-black via-gray-950 to-black text-white'
        }`}>

        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className={`text-4xl font-bold ${darker ? 'text-gray-800' : 'text-white'}`}>{seeWorkout?.name}</h1>
          <p className={`${darker ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
            {seeWorkout?.description}
          </p>
        </div>

        {/* Media Section */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

          {/* Thumbnail / Image */}
          <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-md">
            <img
              src={seeWorkout?.thumbnail}
              alt="Workout Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Video */}
          <div className="w-full h-64 bg-black rounded-2xl overflow-hidden shadow-md">
            <video className="w-full h-full object-cover" controls>
              <source src={seeWorkout?.video} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

          <div className={`p-4 rounded-xl
${darker
              ? 'bg-white border shadow-sm'
              : 'bg-gray-900 border border-gray-800'
            }`}>
            <p className="text-xs text-gray-500">Category</p>
            <h3 className="text-lg font-semibold">{seeWorkout?.category}</h3>
          </div>

          <div className={`p-4 rounded-xl
${darker
              ? 'bg-white border shadow-sm'
              : 'bg-gray-900 border border-gray-800'
            }`}>
            <p className="text-xs text-gray-500">Difficulty</p>
            <h3 className="text-lg font-semibold">{seeWorkout?.difficulty}</h3>
          </div>

          <div className={`p-4 rounded-xl
${darker
              ? 'bg-white border shadow-sm'
              : 'bg-gray-900 border border-gray-800'
            }`}>
            <p className="text-xs text-gray-500">Equipment</p>
            <h3 className="text-lg font-semibold">{seeWorkout?.equipment}</h3>
          </div>

          <div className={`p-4 rounded-xl
${darker
              ? 'bg-white border shadow-sm'
              : 'bg-gray-900 border border-gray-800'
            }`}>
            <p className="text-xs text-gray-500">Duration</p>
            <h3 className="text-lg font-semibold">45 min</h3>
          </div>

        </div>

        {/* Muscle Groups */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4">Muscle Groups Targeted</h2>

          <div className="flex flex-wrap gap-3">
            {seeWorkout?.secondary_muscles?.map((m) => (
              <span
                key={m}
                className={`px-4 py-2 rounded-full font-semibold text-sm
${darker
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-orange-500/20 text-orange-400'
                  }`}
              >
                {m}
              </span>
            ))}

            <span className="px-4 py-2 rounded-full bg-blue-100 text-black font-semibold text-sm">{seeWorkout?.primary_muscles}</span>
          </div>
        </div>

        {/* Sets & Reps */}
        <div className={`max-w-4xl mx-auto bg-${darker ? 'white' : 'black'} p-6 rounded-2xl shadow-sm border mb-12`}>
          <h2 className={`text-2xl font-bold mb-4 ${darker ? 'white' : 'black'}`}>Sets & Reps</h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className={`text-${darker ? 'gray-700' : 'white'} font-medium`}>Push-Ups</span>
              <span className={`text-${darker ? 'gray-900' : 'white'} font-semibold`}>{seeWorkout?.sets} sets</span>
              <span className={`text-${darker ? 'gray-900' : 'white'} font-semibold`}>{seeWorkout?.reps} reps</span>
            </div>



          </div>
        </div>

        {/* Description */}
        <div className={`max-w-4xl mx-auto bg-${darker ? 'white' : 'black'} p-6 rounded-2xl shadow-sm border mb-12`}>
          <h2 className={`text-2xl font-bold mb-4 ${darker ? 'white' : 'black'}`}>Description</h2>

          <p className={`text-${darker ? 'bg-gray-700' : 'white'} leading-relaxed`}>
            {seeWorkout?.description} {seeWorkout?.benefits} {seeWorkout?.tips}
          </p>
        </div>

        {/* Steps / Instructions */}
        <div className={`max-w-4xl mx-auto bg-${darker ? 'white' : 'black'} p-6 rounded-2xl shadow-sm border mb-12`}>
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>

          <ul className={`list-disc pl-6 text-${darker ? 'gray-700' : 'white'} space-y-2`}>
            <li>Warm up for 5 minutes before starting the workout.</li>
            <li>Perform each exercise with slow and controlled motion.</li>
            <li>Focus on proper form over number of reps.</li>
            <li>Rest 60 to 90 seconds between sets.</li>
            <li>Stay hydrated throughout the workout.</li>
          </ul>


        </div>
        <div className="text-center">
          {marked && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50">

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className='absolute cursor-pointer text-orange-400 font-bold hover:text-orange-300' onClick={closeBadge}>X</div>
              {/* Badge Icon Placeholder */}
              <div className="w-24 h-24 mx-auto bg-yellow-300 rounded-full shadow-md flex items-center justify-center text-4xl font-bold">
                <img src={badgeImg} alt="" />

              </div>


              <h2 className="text-xl font-semibold mt-4">Congratulations!</h2>
              <p className="text-gray-600 mt-2">
                You have earned a new badge
              </p>

              <div className="mt-3 text-lg font-medium text-orange-500">
                <span>Badge Type: </span>
                <span className="font-bold">First Workout</span>
              </div>

              <button className="mt-5 bg-orange-600 text-white w-full py-3 rounded-xl font-medium hover:bg-orange-500 transition-all" onClick={() => addBadge(badgeImg)}>
                Add to Profile
              </button>
            </motion.div>
          </div>}

          {mark ? <p className='text-2xl font-mono'>Completed</p> : <button className="bg-orange-500 rounded-2xl p-3 font-bold cursor-pointer hover:bg-orange-400" onClick={() => markWorkout(seeWorkout, 'You just completed a workout!🤸')}>Mark as completed</button>}
        </div>

      </div>
      <footer className={`px-6 md:px-20 py-6 border-t text-sm flex justify-between
${darker
          ? 'border-gray-300 text-gray-700'
          : 'border-gray-800 text-gray-400'
        }`}>
        <p>© {new Date().getFullYear()} MoveMaker. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#">GitHub</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
      <div className='fixed top-4 right-4 flex flex-col z-50 space-y-4 mt-20'>
        {Array.isArray(panel) && panel?.map(item => {
          return (
            <div className='w-full p-4 rounded-2xl bg-black/80 backdrop-blur-2xl h-[40%] text-white flex justify-between gap-5' key={item?.id}>
              <h1>{item?.msg}</h1>
              <span>x</span>
            </div>
          )
        })}
      </div>
    </>
  );
}
