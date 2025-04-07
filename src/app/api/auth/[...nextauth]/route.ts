import NextAuth from "next-auth";
import { authOptions as auth } from "@/lib/auth";

const handler = NextAuth(auth);

export const GET = handler;
export const POST = handler;
