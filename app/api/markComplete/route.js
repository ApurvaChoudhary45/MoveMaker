
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function PUT(request) {
    const body = await request.json()
    const {comp, id} = body

    try {
           const data = (await connection).db('MoveMaker').collection('Tasks')
           const oneWokout = await data.updateOne({_id : new ObjectId(id)}, {$set : {comp : comp}})
           return NextResponse.json({message : 'Added it to your db', oneWokout})
    } catch (error) {
        return NextResponse.json({message : 'Was unable to the data'})
    }

}