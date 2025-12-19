import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function POST(request) {
    try {
        const body = await request.json()
        const {type} = body
        console.log(type)
        const currService = (await connection).db('MoveMaker').collection('MyLibrary')
        const getWorkout = await currService.find({type : type}).toArray()
        return NextResponse.json({message : 'Details Found', getWorkout, status: '200'})
    } catch (error) {
        return NextResponse.json({message : 'Unable to load services', getWorkout, status: '401'})
    }
}