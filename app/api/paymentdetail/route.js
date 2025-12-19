
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import nodemailer from "nodemailer";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function PUT(request) {
    const body = await request.json()
    const { cardNo, month, year, CVV, userID, plan, id, email, name } = body

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
        Subject: 'Your Move Maker Plan Has Been Upgraded 🎉',
        html: `
        Hi ${name},<br>

        Great news! Your <b>Move Maker plan<b> has been successfully upgraded from <b>Free</b> to <b>Basic</b>.<br>

        You now have access to all the features included in the <b>Basic plan</b>.<br>
        
        Start exploring and make the most of your upgraded experience.<br>

        If you have any questions or need help, feel free to reach out.<br>

        Best regards,<br>
        <b>The Move Maker Team</b>
        `
    }

    await transporter.sendMail(mailOptions)


    try {
        const data = (await connection).db('MoveMaker').collection('Plans')
        const oneWokout = await data.updateOne({ _id: new ObjectId(id) }, { $set: { plan: plan, cardNo: cardNo, month: month, year: year, CVV: CVV, userID: userID, email: email, name: name } })
        return NextResponse.json({ message: 'Added it to your db', oneWokout })
    } catch (error) {
        return NextResponse.json({ message: 'Was unable to the data' })
    }

}