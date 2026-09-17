import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validasi input kosong
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Query ke database
    const [rows] = await db.query(
      'SELECT role_lembaga, nama_admin FROM admin WHERE username = ? AND password = ?',
      [username, password]
    );

    // Cek apakah data ditemukan
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Akun tidak terdaftar atau password salah!' },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Return response sukses
    return NextResponse.json({
      success: true,
      role: user.role_lembaga,
      namaAdmin: user.nama_admin,
    });

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada database!' },
      { status: 500 }
    );
  }
}
