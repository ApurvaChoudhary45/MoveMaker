
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { redis } from "@/lib/redis";

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const connection = client.connect()

export async function PUT(request) {
    try {
        const body = await request.json()
        console.log(body)
        const { feet, inches, weight, level, goal, userID, id, image, plan } = body
        const addWork = (await connection).db('MoveMaker').collection('PersonaInfo')
        const updateFields = {
            feet,
            inches,
            weight,
            level,
            goal,
            userID,
            updatedAt: new Date(),
        };

        if (image) {
            updateFields.image = image
        }
        if(plan){
            updateFields.plan = plan
        }
        await addWork.updateOne({ _id: new ObjectId(id) }, { $set: updateFields })

        const cacheKey = `personal:${userID}`;
        await redis.del(cacheKey);
        return NextResponse.json({ message: 'Info updated successfully' }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Could not update the data' }, { status: 500 })
    }

}