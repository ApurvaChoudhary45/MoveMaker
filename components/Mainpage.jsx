'use client'
import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Dumbbell, Clock, Calendar, Badge } from "lucide-react";
import Link from "next/link";

export default function MoveMakerLanding() {
  return (
    <>
    <div className="flex fixed top-5 left-5 gap-3 rounded-2xl bg-gray-600/20 backdrop-blur-2xl">
        <Dumbbell className='text-amber-400'/>
        <h1 className="text-xl font-bold">MoveMaker</h1>
    </div>
    <div className="min-h-screen w-full  font-inter bg-[#ffffff]">
      {/* Hero Section */}
      <section className="w-full px-6 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Build Smarter Workouts.
            <br /> Transform Your Fitness.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className=" mt-6 text-lg"
          >
            MoveMaker helps you craft personalized workouts, track progress, and stay consistent — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 mt-10"
          >
            <Link href = '/SignUp'><button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-lg font-semibold">
              Get Started
            </button></Link>
            <Link href='/Plans'><button className="border border-gray-500 hover:border-white px-6 py-3 rounded-xl text-lg font-semibold">
              Browse Plans
            </button></Link>
          </motion.div>
        </div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-0"
        >
          
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 ">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Features That Power Your Fitness</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          {/* Feature 1 */}
          <div className="p-6  rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
            <Dumbbell size={32} />
            <h3 className="mt-4 text-xl font-semibold">Custom Workout Builder</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Create workouts with exercises, reps, sets & tempo.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6  rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
            <Badge size={32} />
            <h3 className="mt-4 text-xl font-semibold">Premium Badges</h3>
            <p className="mt-2 text-gray-400 text-sm">
             Earn badges by staying consistent and completing workouts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6  rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
            <Clock size={32} />
            <h3 className="mt-4 text-xl font-semibold">Smart Rest Timers</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Stay focused with built-in timers for each set.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6  rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
            <Calendar size={32} />
            <h3 className="mt-4 text-xl font-semibold">Workout Planner</h3>
            <p className="mt-2 text-sm">
              Schedule weekly sessions & stick to your plan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-6 md:px-20 py-15 text-center">
        <h2 className="text-4xl font-bold">Start Building Better Workouts Today</h2>
        <p className=" mt-4">
          MoveMaker is free to use. No credit card required.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-20 py-5 border-t border-gray-800 text-sm flex justify-between">
        <p>© {new Date().getFullYear()} MoveMaker. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#">GitHub</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
    </>
  );
}