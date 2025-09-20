import { NextResponse } from "next/server";
import { findUser } from "@/lib/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await findUser(email);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server misconfiguration: JWT_SECRET is missing" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ email: user.email }, secret, { expiresIn: "7d" });

    const res = NextResponse.json({
      success: true,
      user: { email: user.email }
    });

    // Set HttpOnly cookie with the JWT
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
