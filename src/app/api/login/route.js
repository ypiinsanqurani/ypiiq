import { NextResponse } from 'next/server';
import{ db } from '../../lib/db.js'; 

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Cek username & password di database
    const [rows] = await db.query(
      'SELECT role_lembaga, nama_admin FROM admin WHERE username = ? AND password = ?',
      [username, password]
    );

    const resultData = Array.isArray(rows) ? rows : [rows];

    if (!resultData || resultData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Akun tidak terdaftar atau password salah!' },
        { status: 401 }
      );
    }

    const user = resultData[0];

    // Mengembalikan data sukses tanpa cookie
    return NextResponse.json({
      success: true,
      role: user.role_lembaga,
      namaAdmin: user.nama_admin,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada database!' },
      { status: 500 }
    );
  }
}