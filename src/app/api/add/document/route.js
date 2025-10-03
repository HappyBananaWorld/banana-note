import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.sub;
  } catch (_err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const body = await req.json();
  const { title, folderId, content } = body;

  if (!title || !folderId) {
    return new Response(
      JSON.stringify({ error: "Title and folderId are required" }),
      { status: 400 }
    );
  }

  // Ensure the folder belongs to the authenticated user
  const folder = await prisma.folder.findUnique({ where: { id: Number(folderId) } });
  if (!folder || folder.userId !== userId) {
    return new Response(JSON.stringify({ error: "Folder not found" }), { status: 404 });
  }

  const document = await prisma.document.create({
    data: {
      title,
      content: content || "",
      folderId: Number(folderId),
      userId,
    },
  });

  return new Response(JSON.stringify({ ok: true, document }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
