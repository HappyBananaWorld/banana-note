import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });
    const maxAge = 7 * 24 * 60 * 60;
    // const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
    const secure = ""
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; ${secure}`;

    return new Response(
      JSON.stringify({
        ok: true,
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error",err }), {
      status: 500,
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (_) {}
  }
}
