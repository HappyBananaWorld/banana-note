import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.sub;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }

  const { name } = await req.json();
  if (!name)
    return new Response(JSON.stringify({ error: "Folder name required" }), {
      status: 400,
    });

  const folder = await prisma.folder.create({
    data: {
      name,
      userId, // مستقیم ست کردن userId به جای connect
    },
  });

  return new Response(JSON.stringify({ ok: true, folder }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
