import { NextResponse } from "next/server";
import { deleteLoan, updateLoan, Loan } from "@/lib/loans";
import { getAuth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as Partial<Omit<Loan, "_id">>;
    const updated = await updateLoan(params.id, body);
    if (!updated) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bad Request";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const ok = await deleteLoan(params.id);
    if (!ok) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bad Request";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
