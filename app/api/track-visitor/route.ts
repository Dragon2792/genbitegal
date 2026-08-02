import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ip, perangkat } = body;

    if (!ip || !perangkat) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Cek apakah IP ini sudah tercatat hari ini (1 IP = 1 kunjungan per hari)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.tbl_pengunjung.findFirst({
      where: {
        pengunjung_ip: ip,
        pengunjung_tanggal: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Kalau sudah ada, jangan catat lagi
    if (existing) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Catat kunjungan baru
    await prisma.tbl_pengunjung.create({
      data: {
        pengunjung_ip: ip,
        pengunjung_perangkat: perangkat,
        pengunjung_tanggal: new Date(),
      },
    });

    return NextResponse.json({ ok: true, recorded: true });
  } catch (error) {
    console.error("Track visitor error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
