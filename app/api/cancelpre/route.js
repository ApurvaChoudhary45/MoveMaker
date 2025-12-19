
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import nodemailer from "nodemailer";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function PUT(request) {
    const body = await request.json()
    const { plan, id, email, name } = body
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // your Gmail
            pass: process.env.GMAIL_PASS, // your App Password
        }
    })

    const mailOptions = {
        from: `MoveMaker ${process.env.GMAIL_USER}`,
        to: email,
        Subject: 'We are sad to see you go 💛',
        html: `
        Hi ${name},<br>

        Your Basic plan has been cancelled, and we just wanted to say — we are sad to see you go.<br>

        Thanks for being a part of Move Maker. If you ever feel like jumping back in, you can upgrade again anytime — we’ll be right here to support your journey.<br>

        Start exploring and make the most of your upgraded experience.<br>

        If there’s anything we could’ve done better, we’d love to hear from you.<br>

        Best regards,<br>
        <b>The Move Maker Team</b>
        `
    }
    await transporter.sendMail(mailOptions)


    try {
        const data = (await connection).db('MoveMaker').collection('Plans')
        const oneWokout = await data.updateOne({ _id: new ObjectId(id) }, { $set: { plan: plan } })
        return NextResponse.json({ message: 'Added it to your db', oneWokout })
    } catch (error) {
        return NextResponse.json({ message: 'Was unable to the data' })
    }

}