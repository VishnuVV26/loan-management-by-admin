import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type AuthPayload = {
  email: string;
};

export async function getAuth(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const secret = process.env.JWT_SECRET as string | undefined;
  if (!secret) return null;
  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    return payload;
  } catch {
    return null;
  }
}
