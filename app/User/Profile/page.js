'use client'
import Navbar from '@/components/Navbar'
import React from 'react'
import { PencilIcon, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useEdgeStore } from "@/lib/edgestore";
import { useDispatch, useSelector } from "react-redux"
import Link from 'next/link'
import Loader from '@/components/Loader'
import Spin from '@/components/Spin'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs';
const Profile = () => {
    const { edgestore } = useEdgeStore();
    const { user, isLoaded } = useUser()
    const joined = user?.createdAt
const joinedDate = joined ? new Date(joined) : null
    const [basicModal, setbasicModal] = useState(false)
    const [photoModal, setphotoModal] = useState(false)
    const [url, seturl] = useState('')
    const [file, setfile] = useState(null)
    const [info, setInfo] = useState(null)
    const [coin, setCoin] = useState([])
    const [totalCoin, settotalCoin] = useState(0)
    const [total, settotal] = useState(0)
    const [userEx, setuserEx] = useState([])
    const [cancelModal, setcancelModal] = useState(false)
    const [loading, setloading] = useState(false)
    const darker = useSelector(state => state.dark.mode)
     const { isSignedIn } = useAuth()
    const modalBasic = () => {
        setbasicModal(true)
    }
    const closeBasic = () => {
        setbasicModal(false)
    }
    const openPhoto = () => {
        setphotoModal(true)
    }
    const closePhoto = () => {
        setphotoModal(false)
    }
    const [details, setDetails] = useState({
        feet: '',
        inches: '',
        weight: '',
        level: '',
        goal: '',
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setDetails(prev => ({ ...prev, [name]: value }))
    }
    
    useEffect(() => {
      if(!isLoaded) return
      if( !isSignedIn){
        router.push('/')
      }
     }, [isSignedIn, router])
    useEffect(() => {
        if (!isLoaded || !user) return
        const fetcher = async () => {
            let obj = {
                userID: user?.id,
                email: user?.primaryEmailAddress?.emailAddress
            }
            const data = await fetch('/api/getInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj)
            })
            const res = await data.json()
            console.log(res)
            setInfo(res?.getWorkout?.[0])

        }
        fetcher()
    }, [user, isLoaded])

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
    console.log(user)
    const cancelPlan = () => {
        setcancelModal(true)
    }
    const notCancel = () => {
        setcancelModal(false)
    }

    useEffect(() => {
        if (!user?.id) return
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
        let total = coin.reduce((a, b) => (a + b), 0)
        settotalCoin(total)
    }, [coin])

    

    const uploadPhoto = async () => {
        let upload = url
        if (file) {
            const uploadedURL = await edgestore.publicFiles.upload({
                file
            })
            upload = uploadedURL?.url
            console.log(upload)
            seturl(upload)
        }
        try {
            let obj = {
                feet: details.feet,
                inches: details.inches,
                weight: details.weight,
                level: details.level,
                goal: details.goal,
                userID: user?.id,
                id: info?._id,
                image: upload
            }
            const data = await fetch('/api/personal', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj),
            })
        } catch (error) {
            console.log('Fail to add a photo')
        }

    }
    const updateInfo = async () => {
        let obj = {
            feet: details.feet,
            inches: details.inches,
            weight: details.weight,
            level: details.level,
            goal: details.goal,
            userID: user?.id,
            id: info?._id
        }
        console.log(obj)
        const data = await fetch('/api/personal', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })

        setbasicModal(false)
    }
    useEffect(() => {
        const fetcher = async () => {
            const data = await fetch('/api/mylib')
            const res = await data.json()
            settotal(res?.getWork?.length)
        }
        fetcher()
    }, [])
    useEffect(() => {
        const fetcher = async () => {
            const data = await fetch('/api/extra')
            const res = await data.json()
            console.log(res?.getWorkout[0])
            setuserEx(res?.getWorkout[0])
        }
        fetcher()
    }, [])

    const cancelPre = async () => {
        try {
            setloading(true)
            let obj = {
                plan: 'basic',
                id: userEx?._id,
                email: user?.primaryEmailAddress?.emailAddress,
                name: user?.firstName
            }

            const data = await fetch('/api/cancelpre', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(obj),
            })
            if (!data?.ok) {
                throw new Error('Error in cancelling')
            }
            setcancelModal(false)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }

    }
    useEffect(() => {
    console.log(info)
    console.log(info?._id)
    }, [info])


    return (
        <div>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-sm font-medium">
                        Cancelling Plan...
                    </div>
                </div>
            )}
            <Navbar />
            {basicModal && <div className='fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl z-50'>
                <div className='bg-white w-[75%] rounded-2xl shadow-lg p-10 '>
                    <div className='flex flex-col gap-5'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-5xl font-mono'>Basic Info</h1>
                            <p className='text-xl text-orange-500 hover:text-orange-600 font-semibold cursor-pointer' onClick={closeBasic}>X</p>
                        </div>

                        <div className="flex items-center gap-5 pt-5">

                            <label className="text-sm font-medium">Feet</label>
                            <input
                                type="number"
                                name='feet'
                                value={details?.feet}
                                placeholder="Enter Feet"
                                className="border rounded-xl px-3 py-1"
                                onChange={handleChange}
                            />
                            <label className="text-sm font-medium">Inches</label>
                            <input
                                type="number"
                                placeholder="Enter Inches"
                                value={details?.inches}
                                name='inches'
                                className="border rounded-xl px-3 py-1"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Weight */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="Enter weight"
                                value={details?.weight}
                                className="border rounded-xl px-3 py-2"
                                name='weight'
                                onChange={handleChange}
                            />
                        </div>

                        {/* Fitness Level */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Fitness Level</label>
                            <select className="border rounded-xl px-3 py-2" value={details?.level} onChange={handleChange} name='level'>
                                <option value="">Select</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Goal */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Goal</label>
                            <select className="border rounded-xl px-3 py-2" value={details?.goal} onChange={handleChange} name='goal'>
                                <option value="">Select</option>
                                <option value="fat_loss">Fat Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="strength">Strength</option>
                                <option value="general_fitness">General Fitness</option>
                            </select>
                        </div>

                        {/* Button */}
                        <button className="w-full bg-black text-white py-3 rounded-xl font-medium" onClick={updateInfo}>
                            Update
                        </button>
                    </div>

                </div>

            </div>}
            {photoModal && <div className='fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-2xl z-50'>
                <div className='bg-white w-[55%] rounded-2xl shadow-lg p-10 '>
                    <div>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-4xl font-mono'>Update Photo</h1>
                            <p className='text-xl text-orange-500 hover:text-orange-600 font-semibold cursor-pointer' onClick={closePhoto}>X</p>
                        </div>
                        <div className='flex pt-10'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="120"
                                height="120"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle cx="12" cy="12" r="10" fill="#e5e7eb" />

                                {/* Head */}
                                <circle cx="12" cy="9" r="3" fill="#9ca3af" />

                                {/* Body */}
                                <path
                                    d="M6 18c0-3 2.5-5 6-5s6 2 6 5"
                                    fill="#9ca3af"
                                />
                            </svg>

                        </div>
                        <div className='flex gap-5 justify-between'>

                            <button><input type='file' className='cursor-pointer' onChange={(e) => setfile(e.target.files[0])} /></button>

                            <button className='font-bold bg-orange-500 hover:bg-orange-400 p-3 rounded-2xl' onClick={uploadPhoto}>Upload</button>
                        </div>

                        <div>

                        </div>
                    </div>
                </div>



            </div>}
            <div className={`w-[95%] mx-auto p-4 space-y-6 
${darker ? 'bg-white text-black' : 'bg-black text-white'}`}>


                {/* PROFILE HEADER */}
                <section className={`flex items-center gap-4 p-4 rounded-2xl
${darker ? 'bg-gray-100' : 'bg-gray-900'}`}>
                    {info?.image ? <Image
  src={info.image}
  alt="Profile picture"
  width={80}
  height={80}
  className="rounded-full"
/>: <div className={`${darker ? 'bg-gray-300' : 'bg-gray-700'} w-20 h-20 rounded-full`}/>}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">User Name</h2>
                        <button className="text-sm text-blue-600 underline" onClick={openPhoto}>Edit Photo</button>
                    </div>
                    <div className={`${darker ? 'bg-gray-300 text-black' : 'bg-gray-700 text-white'} rounded-2xl p-2`}>
                        🪙 {totalCoin}
                    </div>
                </section>

                {/* BASIC INFO */}
                <section  className={`p-4 rounded-2xl shadow-sm space-y-3
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    <div className='flex justify-between'>
                        <h3 className="text-lg font-semibold">Basic Info</h3>
                        <PencilIcon className={`${darker ? 'text-orange-400' : 'text-orange-300'} hover:text-orange-600 cursor-pointer`}  onClick={modalBasic} />
                    </div>
                    <div className="space-y-2">
                        <p className='flex gap-2'>Height: <span>{info?.feet} feet</span><span>{info?.inches} inches</span></p>
                        <p>Weight: {info?.weight} kg</p>
                        <p>Fitness Level: {info?.level}</p>
                        <p>Goal: {info?.goal}</p>
                    </div>
                </section>

                {/* WORKOUT SUMMARY */}
                <section  className={`p-4 rounded-2xl shadow-sm space-y-3
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    <h3 className="text-lg font-semibold">Workout Summary/Created</h3>

                    <div>
                        <p className="text-xl font-bold">{total}</p>
                        <p className="text-xs">Workouts</p>
                    </div>


                </section>

                {/* ACHIEVEMENTS PREVIEW */}
                {userEx?.plan === 'premium' && <section  className={`p-4 rounded-2xl shadow-sm space-y-3
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    <h3 className="text-lg font-semibold">Achievements</h3>

                    <div className="flex gap-3 overflow-x-auto">

                        {info?.badges?.map((item, index) => {
                            return (
                                <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center" key={index}>
                                    <Image src={item?.badgeUrl} alt="" className='w-20 h-20' height={20} width={20} />
                                </div>
                            )
                        })}
                    </div>
                </section>}

                {/* QUICK ACTIONS */}
                <section className="grid grid-cols-2 gap-3">
                    <Link href='/User/Progress'><button className={`p-3 rounded-xl w-full transition
${darker ? 'bg-gray-100 hover:bg-gray-200 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>View Progress</button></Link>
                    <Link href='/User/Recent'><button className={`p-3 rounded-xl w-full transition
${darker ? 'bg-gray-100 hover:bg-gray-200 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>History</button></Link>
                </section>

                {/* ACCOUNT INFO */}
                <section  className={`p-4 rounded-2xl shadow-sm space-y-3
${darker ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                    <h3 className="text-lg font-semibold">Account Info</h3>

                    <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
                    <p>Joined: {joinedDate?.toLocaleString()} </p>
                    <div className='flex justify-between items-center'>
                        <p>Membership type: <span className='text-orange-600 font-mono'>{userEx?.plan?.toUpperCase()}</span></p>
                        {userEx?.plan === 'basic' ? <Link href='/Plans'><button className='p-2 rounded-2xl bg-orange-400 hover:bg-amber-500 cursor-pointer'>Upgrade</button></Link> : <button className='bg-gray-500 p-2 rounded-2xl hover:bg-gray-400 cursor-pointer' onClick={cancelPlan}>Cancel</button>}
                    </div>

                </section>


            </div>

            {/* Cancel Plan Modal */}

            {cancelModal && <div className='fixed inset-0 flex justify-center items-center bg-black/20 z-50' onClick={notCancel}>
                <div className='bg-white p-5 w-1/2 rounded-2xl' onClick={(e) => e.stopPropagation()}>
                    <h1 className='text-center'>Are you sure you want to cancel your premium plan?</h1>

                    <div className='flex justify-center items-center gap-5 mt-5'>
                        <button className='bg-orange-400 px-3 py-1 rounded-xl cursor-pointer hover:bg-orange-500 text-lg' onClick={cancelPre}>Yes</button>
                        <button className='bg-gray-400 px-3 py-1 rounded-xl cursor-pointer hover:bg-gray-500 text-lg' onClick={notCancel}>No</button>
                    </div>
                </div>


            </div>}
            <div className="flex px-10 gap-5 mt-8">
                <SignOutButton className={`px-5 py-2 border rounded-lg transition
${darker ? 'border-gray-300 text-black' : 'border-gray-600'}`}>
                    Sign Out
                </SignOutButton>
            </div>

        </div>
    )
}

export default Profile
