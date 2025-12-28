import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    let url = `https://exercisedb-api.vercel.app/api/v1/exercises?offset=0&limit=10`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch exercises: ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
