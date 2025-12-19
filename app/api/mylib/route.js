
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function GET(request) {
    try {
        const addWork = (await connection).db('MoveMaker').collection('MyLibrary')
        const getWork = await addWork.find({}).toArray()
        return NextResponse.json({message : 'Added workout successfully', getWork}, {status : 201})
    } catch (error) {
        return NextResponse.json({message : 'Could not add the data'}, {status : 500})
    }

}