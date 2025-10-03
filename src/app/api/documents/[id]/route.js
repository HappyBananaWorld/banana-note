import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getUserIdFromCookie() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.sub;
    } catch (_) {
        return null;
    }
}

export async function GET(_req, { params }) {
    const userId = getUserIdFromCookie();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const id = Number(params.id);
    if (!id) {
        return new Response(JSON.stringify({ error: "Invalid document id" }), { status: 400 });
    }

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
        return new Response(JSON.stringify({ error: "Document not found" }), { status: 404 });
    }

    return new Response(
        JSON.stringify({ ok: true, document: { id: doc.id, title: doc.title, content: doc.content } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}

export async function PUT(req, { params }) {
    const userId = getUserIdFromCookie();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const id = Number(params.id);
    if (!id) {
        return new Response(JSON.stringify({ error: "Invalid document id" }), { status: 400 });
    }

    const payload = await req.json();
    const { title, content } = payload || {};
    if (!title && typeof content !== "string") {
        return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        return new Response(JSON.stringify({ error: "Document not found" }), { status: 404 });
    }

    const updated = await prisma.document.update({
        where: { id },
        data: {
            title: typeof title === "string" ? title : existing.title,
            content: typeof content === "string" ? content : existing.content,
        },
    });

    return new Response(
        JSON.stringify({ ok: true, document: { id: updated.id, title: updated.title, content: updated.content } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}


