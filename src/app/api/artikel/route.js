import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db.js';

// -----------------------------------------------------------------
// 1. AMBIL DAFTAR ARTIKEL UNTUK TABEL ADMIN (Berdasarkan Role/Slug)
// -----------------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let query = 'SELECT id, slug_lembaga, judul, tanggal FROM table_artikel';
    let params = [];

    if (slug && slug !== 'all') {
      query += ' WHERE slug_lembaga = ?';
      params.push(slug.toLowerCase());
    }

    query += ' ORDER BY id DESC';
    const [rows] = await db.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -----------------------------------------------------------------
// 2. SIMPAN ARTIKEL BARU (Menerima JSON dari Client)
// -----------------------------------------------------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const { slug_lembaga, judul, isi_artikel, gambar_url } = body;

    if (!slug_lembaga || !judul || !isi_artikel) {
      return NextResponse.json({ error: 'Data kurang lengkap, Ustadz!' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO table_artikel (slug_lembaga, judul, isi_artikel, gambar_url) VALUES (?, ?, ?, ?)',
      [slug_lembaga.toLowerCase(), judul, isi_artikel, gambar_url || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -----------------------------------------------------------------
// 3. HAPUS ARTIKEL DARI DATABASE (DELETE)
// -----------------------------------------------------------------
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID artikel gaib!' }, { status: 400 });

    await db.query('DELETE FROM table_artikel WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Artikel musnah dari database!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
