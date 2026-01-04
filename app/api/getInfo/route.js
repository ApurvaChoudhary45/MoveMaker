import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { redis } from "@/lib/redis";

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
const connection = client.connect();

export async function POST(request) {
  try {
    const body = await request.json();
    const { userID, email } = body;

    const cacheKey = `personal:${userID}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Coming from redis");
      return NextResponse.json({
        message: "Details Found",
        getWorkout: cached,
        status: "200",
      });
    }

    const currService = (await connection)
      .db("MoveMaker")
      .collection("PersonaInfo");

    let getWorkout = await currService.findOne({userID});

    // Cache fresh data
    await redis.set(cacheKey, getWorkout, { ex: 3600 });

    console.log("Coming from db");
    console.log(getWorkout);

    return NextResponse.json({
      message: "Details Found",
      getWorkout,
      status: "200",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Unable to load services",
      status: "500",
    });
  }
}
