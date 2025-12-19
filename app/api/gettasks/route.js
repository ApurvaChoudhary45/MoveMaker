
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function GET(request) {
    try {
           const data = (await connection).db('MoveMaker').collection('Tasks')
           const tasking = await data.find().toArray()
           return NextResponse.json({message : 'Added it to your db', tasking})
    } catch (error) {
        return NextResponse.json({message : 'Was unable to the data'})
    }
    
 



}