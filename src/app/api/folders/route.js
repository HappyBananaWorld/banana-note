import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET() {
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

    const folders = await prisma.folder.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
    });

    return new Response(JSON.stringify({ ok: true, folders }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}


