import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Exercise ID is required" },
        { status: 400 }
      );
    }

    const url = `https://exercisedb-api.vercel.app/api/v1/exercises/${id}`;

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "MoveMaker-App"
      }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `External API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data });

  } catch (error) {
    console.error("Single exercise error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
