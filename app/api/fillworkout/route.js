import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { redis } from "@/lib/redis";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function POST(request) {
    try {
        const body = await request.json()
        const {slug} = body
        console.log(slug)

        const cacheKey = `workouts:${slug}`

        const cacheData = await redis.get(cacheKey)
        if(cacheData){
            return NextResponse.json({message : 'Details Found', getWorkout: cacheData, status: '200'})
        }

        const currService = (await connection).db('MoveMaker').collection('WorkOut')
        const getWorkout = await currService.find({category : {$regex: slug, $options: "i" } }).toArray()
        await redis.set(cacheKey, getWorkout, {ex: 3600})
        return NextResponse.json({message : 'Details Found', getWorkout, status: '200'})
    } catch (error) {
        return NextResponse.json({message : 'Unable to load services', getWorkout, status: '401'})
    }
}