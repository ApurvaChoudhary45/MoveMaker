
import { NextResponse } from "next/server";

import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function GET(request, {params}) {
    try {
        const {id} = await params
        console.log(id)
       const allWorkOut = (await connection).db('MoveMaker').collection('Collection')
       const getWorkout = await allWorkOut.findOne({slug : id})
       console.log(getWorkout)
     
       return NextResponse.json({message : 'Here is the list', getWorkout},{status : 200}) 
    } catch (error) {
        return NextResponse.json({message : 'Was unable to find the list'},{status : 404}) 
    }
    

}