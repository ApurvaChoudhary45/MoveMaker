import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
  const URI = process.env.MONGO_URI
  const client = new MongoClient(URI)
  const connection = client.connect()
export async function GET(request, {params}) {

      const { id } = await params

  const getWorkout = (await connection).db('MoveMaker').collection('WorkOut')
  const seeWorkout = await getWorkout.findOne({ _id: new ObjectId(id) })
  return NextResponse.json({message: 'Found the data', seeWorkout}, {status : 201})

}


