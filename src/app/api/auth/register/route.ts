import { NextResponse } from "next/server";
import { registerUser } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await registerUser(email, password);
    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bad Request";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
