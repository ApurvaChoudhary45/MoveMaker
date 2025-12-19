
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function POST(request) {
    try {
        const body = await request.json()
        const addWork = (await connection).db('MoveMaker').collection('Notifications')
        await addWork.insertOne(body)
        return NextResponse.json({message : 'Notifications'}, {status : 201})
    } catch (error) {
        return NextResponse.json({message : 'Could not add the data'}, {status : 500})
    }

}