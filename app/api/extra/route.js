
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function GET(request) {
    try {
        
       const smartplan = (await connection).db('MoveMaker').collection('Plans')
       const getWorkout = await smartplan.find({}).toArray()
       console.log(getWorkout)
     
       return NextResponse.json({message : 'Here is the list', getWorkout},{status : 200}) 
    } catch (error) {
        return NextResponse.json({message : 'Was unable to find the list'},{status : 404}) 
    }
    

}