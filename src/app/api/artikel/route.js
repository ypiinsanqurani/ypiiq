import { NextResponse } from 'next/server';
import { db } from '../../lib/db.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// -----------------------------------------------------------------
// 1. AMBIL DAFTAR ARTIKEL UNTUK TABEL ADMIN (Berdasarkan Role/Slug)
// -----------------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let query = 'SELECT id, slug_lembaga, judul, tanggal FROM table_artikel';
    let params = [];

    // Kalau rolenya bukan 'all' (misal cuma 'sd'), saring biar gak ngintip sekolah lain
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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const aksi = formData.get('aksi');

    // UPLOAD GAMBAR LOKAL
    if (aksi === 'upload_gambar') {
      const file = formData.get('image');
      if (!file) return NextResponse.json({ error: 'File ketiup angin!' }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const namaFileUnik = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const folderTujuan = join(process.cwd(), 'public', 'uploads');
      await mkdir(folderTujuan, { recursive: true });
      await writeFile(join(folderTujuan, namaFileUnik), buffer);

      return NextResponse.json({ url: `/uploads/${namaFileUnik}` });
    }

    // SIMPAN ARTIKEL BARU
    if (aksi === 'simpan_artikel') {
      const slug_lembaga = formData.get('slug_lembaga');
      const judul = formData.get('judul');
      const isi_artikel = formData.get('isi_artikel');

      if (!slug_lembaga || !judul || !isi_artikel) {
        return NextResponse.json({ error: 'Data kurang lengkap, Ustadz!' }, { status: 400 });
      }

      await db.query(
        'INSERT INTO table_artikel (slug_lembaga, judul, isi_artikel) VALUES (?, ?, ?)',
        [slug_lembaga.toLowerCase(), judul, isi_artikel]
      );
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -----------------------------------------------------------------
// 2. HAPUS ARTIKEL DARI DATABASE (DELETE)
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