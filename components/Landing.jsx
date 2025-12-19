'use client'
import React from 'react'
import { animate, easeInOut, motion, scale } from 'framer-motion'
import { Dumbbell } from 'lucide-react'
import { useState, useEffect } from 'react'
import Mainpage from './Mainpage'
const Landing = () => {
    const [load, setload] = useState(false)
    useEffect(() => {
        let setTimer;
        setTimer = setTimeout(() => {
            setload(true)
        }, 2000);
        return ()=>clearTimeout(setTimer)
    }, [])
    const animation = (delay)=>({
       initial : {
        position : 'fixed',
        top : '50%',
        left : '50%',
        translateX : '-50%',
        translateY : '-50%',
        opacity : 1,
        scale : 3
       },
       animate : {
        top : load ? '20px' : '50%',
        left : load ? '20px' : '50%',
        translateX : load ? '0%' : '-50%',
        translateY : load ? '0%' : '-50%',
        opacity : load ? 1 : 1,
        scale : load ? 1 : 3
       },
       transition : {
        duration : delay,
        ease : 'easeInOut'
       },
    })
  return (
    <div>
     <motion.div className='flex gap-3' variants={animation(1)} style={{zIndex : 50, position : 'fixed'}} initial='initial' animate='animate'>
        <Dumbbell className='text-amber-400'/>
        <h1 className='text-xl font-bold'>MoveMaker</h1>
     </motion.div>
     <motion.div initial={{opacity : 0}} animate={{opacity : load ? 1 : 0}} style={{zIndex : 10}} transition={{delay : 1, duration : 1}}>
        <Mainpage/>
     </motion.div>
    </div>
  )
}

export default Landing
