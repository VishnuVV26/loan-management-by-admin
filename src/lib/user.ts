import clientPromise from "./mongodb";
import { Db } from "mongodb";
import bcrypt from "bcrypt";
let db: Db;

async function getDB() {
  if (!db) {
    const client = await clientPromise;
    db = client.db("loan-management"); 
  }
  return db;
}

export async function registerUser(email: string, password: string) {
  const database = await getDB();
  const users = database.collection("users");

  const existing = await users.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ email, password: hashed });

  return { email };
}

export async function findUser(email: string) {
  const database = await getDB();
  return database.collection("users").findOne({ email });
}
