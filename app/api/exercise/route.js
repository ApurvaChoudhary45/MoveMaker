import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const offset = searchParams.get("offset") || 0;
  const limit = searchParams.get("limit") || 10;
  const search = searchParams.get("search");

  let url = `https://exercisedb-api.vercel.app/api/v1/exercises?offset=${offset}&limit=${limit}`;

  if (search) {
    url += `&search=${search}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
