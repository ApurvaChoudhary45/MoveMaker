'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import { Dumbbell, SearchIcon } from "lucide-react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { ArrowRight } from "lucide-react";
import { searchFilter } from "@/Redux/search/search";
import Spinner from '@/components/Spinner';

const Collection = () => {
  let params = useParams()
  const [loading, setloading] = useState(false)
  const [text, settext] = useState('')
  const [collections, setcollections] = useState(null)
  let { user } = useUser()
  const searchedQuery = (text) => {
    dispatch(searchFilter(text))
    router.push(`/User/Exercises?query=${text}`)

  }
  useEffect(() => {
    const fetcher = async () => {
      setloading(true)
      try {
        const data = await fetch(`/api/collection/${params.id}`)
        const res = await data.json()
        console.log(res)
        setcollections(res?.getWorkout)
        setloading(false)
      } catch (error) {
        console.log('Hey unable to get the collection')
      }
    }
    fetcher()
  }, [])
  return (
    <>
      <div className='flex justify-between items-center w-full fixed px-10 z-50 bg-black  p-3'>
        <span className="flex top-5 left-5 gap-3">
          <Dumbbell className='text-amber-400' />
          <h1 className="text-xl font-bold text-white">MoveMaker</h1>

        </span>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/User/Dashboard" className="text-gray-200 hover:text-white">Dashboard</Link>
          <Link href="/User/Workouts" className="text-gray-200 hover:text-white">Explore Workouts</Link>
          <Link href="/User/Exercises" className="text-gray-200 hover:text-white">Exercises</Link>
        </div>
        <div className="flex gap-3 items-center w-1/3">
          <input
            type="text"
            placeholder="Search an exercise..."
            value={text}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => settext(e.target.value)}

          />
          <SearchIcon className='text-orange-400 cursor-pointer' onClick={() => searchedQuery(text)} />



        </div>
        <div className='flex items-center gap-3'>
          <h1 className='text-white'>{user?.primaryEmailAddress?.emailAddress}</h1>
          <SignOutButton className='bg-orange-400 p-2 rounded-2xl font-bold' routing="hash" redirectUrl="/">Sign out</SignOutButton>
        </div>
      </div>
      {loading ? <Spinner/> : <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border border-neutral-200 dark:border-neutral-800 pt-30">

        {/* Title */}
        <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border border-neutral-200 dark:border-neutral-800 ">

          {/* Title */}
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {collections?.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {collections?.description}
          </p>

          {/* Info Row */}
          <div className="flex items-center justify-between mt-3 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-medium">⏱ {collections?.duration}</span>
            <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs">
              {collections?.difficulty}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {collections?.tags?.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Exercises Section */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200">
              Exercises Included
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              {collections?.exercises?.map((ex, i) => (
                <div
                  key={i}
                  className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-800"
                >
                  {/* Exercise Name */}
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {ex.name}
                  </h4>

                  {/* Duration */}
                  {ex.duration && (
                    <p className="text-xs mt-1 text-neutral-600 dark:text-neutral-300">
                      ⏱ {ex.duration}
                    </p>
                  )}

                  {/* Instructions */}
                  {ex.instructions && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Instructions:
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {ex.instructions}
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  {ex.tips?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Tips:
                      </p>
                      <ul className="text-xs text-neutral-600 dark:text-neutral-400 list-disc pl-4 mt-1">
                        {ex.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {ex.common_mistakes?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-red-500">
                        Common Mistakes:
                      </p>
                      <ul className="text-xs text-neutral-600 dark:text-neutral-400 list-disc pl-4 mt-1">
                        {ex.common_mistakes.map((m, index) => (
                          <li key={index}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-end text-neutral-800 dark:text-neutral-200">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

      </div>}
    </>

  )
}

export default Collection
