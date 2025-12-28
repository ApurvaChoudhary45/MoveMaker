import React from 'react'
import { useState, useRef, useEffect } from 'react'

import Loading from './Loading'
const Chatbot = ({onClose}) => {
    
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState('')
    const [isBotTyping, setIsBotTyping] = useState(false)
    const ref = useRef(null)
    const botResponse = async () => {
        let obj = {
            message: message,
            sender: 'User'
        }
        setmessages([...messages, obj])
        setIsBotTyping(true)
        const data = await fetch('/api/bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(obj),
        })
        const res = await data.json()
        console.log(res?.reply)
        setmessages(prev => [...prev, { message: res?.reply, sender: 'Bot' }])
        setIsBotTyping(false)
        setmessage('')


    }
    useEffect(() => {
        ref.current?.scrollIntoView({behavior : 'smooth'})
    }, [messages])
    
    return (
        <div className='fixed inset-0 flex justify-end items-end z-50 mb-10 mr-10'>
            <div className="bg-gradient-to-br bg-gradient-to-bl
from-[#edd2f3]
via-[#fffcdc]
to-[#84dfff] shadow-2xl rounded-2xl md:w-1/4 h-[65%] relative flex flex-col w-[80%]">
                {/* Header */}
                <div className="md:flex justify-between items-center px-4 py-3 border-b border-gray-300">
                    <h1 className="text-lg font-semibold text-gray-800">AI Bot - Here to assist 🤖</h1>
                    <button
                        className="text-gray-600 hover:text-red-500 transition-colors duration-200 font-bold"
                        onClick={onClose}

                    >
                        ✕
                    </button>
                </div>

                {/* Chat area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <p className="text-black text-sm font-bold"> Wanna stay fit? Ask me anything 🏋️‍♂️</p>
                    {/* Future messages will go here */}
                    {messages.map((item, index) => {
                        return (<div key={index} className='overflow-y-auto p-2 flex-1' >
                            <h3>{item.sender === 'User' ? (<div className='flex justify-start w-full'><p className='text-white font-semibold text-sm bg-orange-400 px-4 py-2 rounded-2xl'>{item.message}</p></div>) : (<div className='flex justify-end w-full'><div className='flex flex-col justify-end items-end bg-gray-900 font-semibold w-fit rounded-2xl my-5 p-2 text-md'>{item.message}</div></div>)}</h3>



                        </div>)
                    })}

                    {isBotTyping && <div className="flex justify-end w-full mb-10">
                    <Loading className="bg-gray-200 rounded-2xl p-3 w-fit my-5" />
                </div>}

                <div ref={ref}></div>
                </div>

                

                {/* Input area */}
                <div className="absolute bottom-1 w-full px-4">
                    <div className="flex items-center bg-white rounded-full shadow-md px-3 py-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 px-2"
                            value={message}
                            onChange={(e) => setmessage(e.target.value)}
                        />
                        <button className="ml-2 bg-orange-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-full transition duration-200" onClick={botResponse}>
                            Send
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chatbot
