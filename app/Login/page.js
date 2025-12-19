'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell } from "lucide-react";
import { useRouter } from 'next/navigation';
import {  SignIn } from '@clerk/nextjs'
const ClientSignUp = () => {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [conPass, setConPass] = useState('')
    const router = useRouter()


    
    return (
        <div>
            <Link href='/'><div className="flex fixed top-5 left-5 gap-3 bg-white  w-full">
        <Dumbbell className='text-amber-400'/>
        <h1 className="text-xl font-bold">MoveMaker</h1>
    </div></Link>
            <div className="md:min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-30">

                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* Left: Welcome / Branding */}
                    <aside className="hidden md:flex flex-col justify-center items-start p-8 bg-gradient-to-br from-gray-400 to-gray-800 text-white">
                        <h1 className="text-2xl font-extrabold mb-2 font-mono">
                            Build workouts, track progress, and transform your fitness — all in one place.
                        </h1>

                        <p className="text-sm opacity-90 mb-6">
                            MoveMaker helps you plan smarter, train better, and stay consistent with personalized workout routines.
                        </p>

                        <div className="w-full">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 bg-white rounded-full mt-2/3" />
                                    <span>Create custom workout plans with drag-and-drop exercises</span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 bg-white rounded-full mt-2/3" />
                                    <span>Track sets, reps, weights, and personal records with ease</span>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 bg-white rounded-full mt-2/3" />
                                    <span>Stay motivated with progress analytics, streaks, and goals</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-auto text-xs opacity-90">
                            <span>Do not have an account create one today?</span>
                            <div className="mt-2 inline-flex items-center gap-2">
                                <Link href='/SignUp'><button className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm">
                                    Sign Up
                                </button></Link>

                                <Link href='/Extras/LearnMore'><button className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">
                                    Learn more
                                </button></Link>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Forms */}
                    <main className="md:px-10 ">
                        <div className="max-w-md md:mx-auto ">
                            {/* Toggle / Tabs (visual only) */}
                            
                            <SignIn routing="hash" redirectUrl="/User/Dashboard" />

                           
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ClientSignUp
