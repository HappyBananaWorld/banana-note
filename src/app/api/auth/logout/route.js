export async function POST() {
    const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`;
    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            "Set-Cookie": cookie,
            "Content-Type": "application/json",
        },
    });
}


