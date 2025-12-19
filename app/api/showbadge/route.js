
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()
export async function PUT(request) {

    const body = await request.json()
    console.log(body)
    const {badgeUrl, userID} = body
    console.log(badgeUrl)

    try {
           const data = (await connection).db('MoveMaker').collection('Personal')
           const badgeInfo = await data.updateOne({userID : userID}, {$push : {badges : {badgeUrl}}})
           return NextResponse.json({message : 'Added it to your db', badgeInfo})
    } catch (error) {
        return NextResponse.json({message : 'Was unable to load the badge'})
    }
    
 



}