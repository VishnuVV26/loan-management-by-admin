import clientPromise from "./mongodb";
import { Db, ObjectId } from "mongodb";

export type LoanPayment = {
  amount: number;
  date: string; // ISO date string
};

export type Loan = {
  _id?: string;
  sno: number;
  name: string;
  givenDate: string; // ISO date string
  totalAmount: number; // principal or total agreed amount
  interest: number; // interest amount or percentage depending on your business rule
  paid: LoanPayment[];
};

// Representation stored in MongoDB (uses ObjectId instead of string)
type DbLoan = Omit<Loan, "_id"> & { _id?: ObjectId };

let db: Db;
async function getDB() {
  if (!db) {
    const client = await clientPromise;
    db = client.db(process.env.MONGODB_DB || "loan-management");
  }
  return db;
}

export async function listLoans(): Promise<Loan[]> {
  const database = await getDB();
  const loans = await database.collection<DbLoan>("loans").find({}).sort({ sno: 1 }).toArray();
  return loans.map<Loan>((l) => ({ ...l, _id: l._id?.toString() }));
}

export async function createLoan(data: Omit<Loan, "_id">): Promise<Loan> {
  const database = await getDB();
  const res = await database.collection<DbLoan>("loans").insertOne({ ...data });
  return { ...data, _id: res.insertedId.toString() };
}

export async function updateLoan(id: string, data: Partial<Omit<Loan, "_id">>): Promise<Loan | null> {
  const database = await getDB();
  const _id = new ObjectId(id);
  await database.collection<DbLoan>("loans").updateOne({ _id }, { $set: data });
  const updated = await database.collection<DbLoan>("loans").findOne({ _id });
  return updated ? { ...updated, _id: updated._id?.toString() } : null;
}

export async function deleteLoan(id: string): Promise<boolean> {
  const database = await getDB();
  const _id = new ObjectId(id);
  const res = await database.collection("loans").deleteOne({ _id });
  return res.deletedCount === 1;
}
