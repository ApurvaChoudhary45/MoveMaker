
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function PUT(request) {
    try {
        const body = await request.json()
        const {feet, inches, weight, level, goal, userID, id, image} = body
        const addWork = (await connection).db('MoveMaker').collection('Personal')
        await addWork.updateOne({_id : new ObjectId(id)}, {$set : {feet : feet, inches : inches, weight : weight, level : level, goal : goal, userID : userID, image : image}})
        return NextResponse.json({message : 'Info updated successfully'}, {status : 201})
    } catch (error) {
        return NextResponse.json({message : 'Could not update the data'}, {status : 500})
    }

}