'use client'
import { Check, Star, Crown } from "lucide-react";
import { Dumbbell, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
export default function PricingPage() {
  const [userEx, setuserEx] = useState([])
   useEffect(() => {
          const fetcher = async()=>{
              const data = await fetch('/api/extra')
              const res = await data.json()
              console.log(res?.getWorkout[0])
              setuserEx(res?.getWorkout[0])
          }
          fetcher()
      }, [])
  return (
    <>

      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-8 px-6">
        <span className="flex  left-5 gap-3">
          <Dumbbell className='text-amber-400' />
          <Link href='/'><h1 className="text-xl font-bold text-black hover:text-amber-400 cursor-pointer">MoveMaker</h1></Link>

        </span>
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Pick the perfect plan to stay consistent and level up your progress.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* FREE PLAN */}
          
          {userEx?.plan === 'basic' ? <div className="p-8 border rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
            <div className="absolute top-[39%] left-[36%] translate-x-1/2 bg-gray-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
              Current Plan
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Free Plan
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-5">
              Best for getting started.
            </p>

            <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6">
              ₹0<span className="text-lg text-gray-500">/month</span>
            </h3>

            {/* Features */}
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {[
                "Daily 3 tasks",
                "Daily coin rewards",
                "Weekly check-in",
                "Streak system",
                "Motivational messages",
                "Basic badges",
                "Default themes"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  {item}
                </li>
              ))}
            </ul>

            
          </div> : <div className="p-8 border rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Free Plan
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-5">
              Best for getting started.
            </p>

            <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6">
              ₹0<span className="text-lg text-gray-500">/month</span>
            </h3>

            {/* Features */}
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {[
                "Daily 3 tasks",
                "Daily coin rewards",
                "Weekly check-in",
                "Streak system",
                "Motivational messages",
                
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  {item}
                </li>
              ))}
            </ul>

            <Link href='/Login'><button className="w-full mt-55 bg-gray-800 dark:bg-gray-700 text-white py-3 rounded-xl font-semibold bottom-0">
              Get Started
            </button></Link>
          </div>}

          {/* BASIC PLAN */}
          <div className="p-8 border-2 border-yellow-400 rounded-2xl bg-yellow-50 dark:bg-neutral-800 shadow-md relative">

            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Crown className="text-yellow-500" /> Basic Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Unlock all premium features.
            </p>

            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              ₹199<span className="text-lg text-gray-500">/month</span>
            </h3>

            {/* Features */}
            <ul className="space-y-3 text-gray-800 dark:text-gray-300">
              {[
                "Unlimited daily tasks",
                "Custom tasks",
                "Daily coin rewards",
                "Weekly check-in",
                "Streak system",
                "Motivational messages",
                "Premium badges",
                "Boosted coin rewards",
                "Dark mode + premium themes",
              
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Star className="text-yellow-500" size={18} />
                  {item}
                </li>
              ))}
            </ul>

            <Link href='/Payment'><button className="w-full mt-8 bg-yellow-500 text-black py-3 rounded-xl font-semibold hover:bg-yellow-400 transition">
              Upgrade Now
            </button></Link>
          </div>

        </div>
      </div>
    </>
  );
}
