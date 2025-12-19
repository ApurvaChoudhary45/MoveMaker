'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
const Page = () => {
const router = useRouter()

    
  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/128/7922/7922188.png"
        alt="WorkOut Created"
        className="w-28 h-28 mb-6"
      />

      <h1 className="text-4xl font-bold text-green-600 mb-4">Work Out Created!</h1>
      <p className="text-gray-600 text-lg mb-8">
        Your workout has been created successfully. You can check My Library!
      </p>

      <button
        onClick={() => router.push(`/User/Dashboard`)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-lg transition cursor-pointer"
      >
        Back to Dashboard
      </button>
    </div>
    </div>
  )
}

export default Page
