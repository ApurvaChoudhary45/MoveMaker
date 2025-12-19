
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function POST(request) {

    const body = await request.json()
    try {
           const data = (await connection).db('MoveMaker').collection('Completed')
           const oneWokout = await data.insertOne(body)
           return NextResponse.json({message : 'Added it to your db', oneWokout})
    } catch (error) {
        return NextResponse.json({message : 'Was unable to the data'})
    }
    
 



}