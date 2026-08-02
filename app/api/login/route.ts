import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Semua kolom harus diisi" }, { status: 400 });
    }

    const user = await prisma.tbl_pengguna.findFirst({
      where: { pengguna_username: username }
    });

    if (user && user.pengguna_password) {
      const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
      
      if (hashedPassword === user.pengguna_password) {
        const sessionData = {
          id: user.pengguna_id,
          name: user.pengguna_nama,
          level: user.pengguna_level
        };
        
        const val = Buffer.from(JSON.stringify(sessionData)).toString('base64');
        
        const response = NextResponse.json({ success: true });
        response.cookies.set({
          name: "genbi_admin_session",
          value: val,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
        
        return response;
      }
    }

    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
