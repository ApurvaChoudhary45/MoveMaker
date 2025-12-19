"use client";
import { CreditCard, ShieldCheck, Wallet, Smartphone, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import Spin from "@/components/Spin";
export default function FakePaymentUI() {
    const router = useRouter()
    const { user, isLoaded, isSignedIn } = useUser()
    const [userEx, setuserEx] = useState([])
    const [loading, setloading] = useState(false)
    const [card, setcard] = useState({
        cardNo: '',
        month: 0,
        year: 0,
        CVV: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setcard(prev => ({ ...prev, [name]: value }))
    }

    const userDataPlan = async () => {
        try {
            if (!userEx?._id || !user?.id || !isLoaded || !isSignedIn) {
                return
            }
            setloading(true)
            let details = {
                cardNo: card.cardNo,
                month: card.month,
                year: card.year,
                CVV: card.CVV,
                userID: user?.id,
                plan: 'premium',
                id: userEx?._id,
                email: user?.primaryEmailAddress?.emailAddress,
                name: user?.firstName
            }
            const data = await fetch('/api/paymentdetail', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(details)
            })
            
            if (!data.ok) {
                throw new Error('Error in processing the payment')
            }
            router.push('/User/Dashboard')
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }
    useEffect(() => {
        const fetcher = async () => {
            const data = await fetch('/api/extra')
            const res = await data.json()
            console.log(res?.getWorkout[0])
            setuserEx(res?.getWorkout[0])
        }
        fetcher()
    }, [])


    return (
        <>
        {loading && <Spin/>}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">

                <div className="w-full max-w-md rounded-2xl shadow-xl">
                    <span className="flex left-5 gap-3 bg-gradient-to-br from-slate-100 to-slate-200">
                        <Dumbbell className='text-amber-400' />
                        <Link href='/'><h1 className="text-xl font-bold text-black hover:text-amber-400 cursor-pointer">MoveMaker</h1></Link>

                    </span>
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-semibold">Complete Payment</h1>
                            <p className="text-sm text-muted-foreground">This is a demo payment screen</p>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                            <span className="text-sm text-muted-foreground">Amount to pay</span>
                            <span className="text-xl font-bold">₹199</span>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium">Choose Payment Method</h2>

                            <div className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                                <CreditCard className="w-5 h-5" />
                                <span className="text-sm">Credit / Debit Card</span>
                            </div>

                        </div>

                        {/* Fake Card Details */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium">Card Details</h2>
                            <input
                                placeholder="Card Number"
                                className="w-full p-3 border rounded-xl text-sm"
                                type="text"
                                value={card.cardNo}
                                onChange={handleChange}
                                name="cardNo"
                            />
                            <div className="flex gap-3">
                                <input
                                    placeholder="MM"
                                    className="w-1/2 p-3 border rounded-xl text-sm"
                                    type="number"
                                    value={card.month}
                                    name="month"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="YY"
                                    className="w-1/2 p-3 border rounded-xl text-sm"
                                    type="number"
                                    value={card.year}
                                    name="year"
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="CVV"
                                    className="w-1/2 p-3 border rounded-xl text-sm"
                                    type="text"
                                    value={card.CVV}
                                    name="CVV"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button className="w-full rounded-xl bg-black text-white py-3" onClick={userDataPlan} disabled={loading}>
                           {loading ? "Processing payment..." : "Pay ₹199"}
                        </button>

                        {/* Footer */}
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="w-4 h-4" />
                            <span>100% Secure • Demo Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
