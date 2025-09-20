import { NextResponse } from "next/server";
import { createLoan, listLoans, Loan } from "@/lib/loans";
import { getAuth } from "@/lib/auth";

export async function GET() {
  try {
    const data = await listLoans();
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as Omit<Loan, "_id">;
    const created = await createLoan(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bad Request";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
