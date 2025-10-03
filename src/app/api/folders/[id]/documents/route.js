import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(_req, { params }) {
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

    const folderId = Number(params.id);
    if (!folderId) {
        return new Response(JSON.stringify({ error: "Invalid folder id" }), { status: 400 });
    }

    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder || folder.userId !== userId) {
        return new Response(JSON.stringify({ error: "Folder not found" }), { status: 404 });
    }

    const documents = await prisma.document.findMany({
        where: { folderId, userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
    });

    return new Response(JSON.stringify({ ok: true, documents }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}


