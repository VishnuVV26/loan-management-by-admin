import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
    try{
        const client=await clientPromise;
        const db=client.db("loanDB");
        const result=await db.collection("users").find({}).toArray();
        return NextResponse.json({result});
    }
    catch(error){
        return NextResponse.json({error});
    }
}