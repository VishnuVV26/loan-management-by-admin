import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuth();
    if (!auth) return NextResponse.json({ authenticated: false });
    return NextResponse.json({ authenticated: true, user: auth });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ authenticated: false, message }, { status: 500 });
  }
}
