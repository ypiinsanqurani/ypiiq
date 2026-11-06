import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { del } from "@vercel/blob"; // Opsional: untuk hapus file di Vercel Blob

// Konfigurasi koneksi TiDB / MySQL lo
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 4000,
  ssl: { rejectUnauthorized: true } // Wajib untuk TiDB Cloud
};

// 1. [GET] - API UNTUK MENGAMBIL DAFTAR FOTO GALERI
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const connection = await mysql.createConnection(dbConfig);
    let query = "SELECT * FROM table_galeri ORDER BY id DESC";
    let values = [];

    if (slug && slug !== "all") {
      query = "SELECT * FROM table_galeri WHERE slug_lembaga = ? ORDER BY id DESC";
      values = [slug];
    }

    const [rows] = await connection.execute(query, values);
    await connection.end();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("API GET Galeri Error:", error);
    return NextResponse.json({ pesan: "Gagal mengambil data galeri" }, { status: 500 });
  }
}

// 2. [POST] - API UNTUK MENYIMPAN URL VERCEL BLOB KE DATABASE TiDB
export async function POST(request) {
  try {
    const body = await request.json();
    const { aksi, slug_lembaga, caption, url_gambar } = body;

    if (aksi === "simpan_galeri") {
      if (!url_gambar) {
        return NextResponse.json({ pesan: "URL gambar tidak ditemukan" }, { status: 400 });
      }

      // Simpan data ke TiDB MySQL
      const connection = await mysql.createConnection(dbConfig);
      const queryInsert = "INSERT INTO table_galeri (slug_lembaga, caption, url_gambar) VALUES (?, ?, ?)";
      await connection.execute(queryInsert, [slug_lembaga, caption, url_gambar]);
      await connection.end();

      return NextResponse.json({ pesan: "Berhasil menyimpan galeri!" }, { status: 201 });
    }

    return NextResponse.json({ pesan: "Aksi tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("API POST Galeri Error:", error);
    return NextResponse.json({ pesan: "Gagal memproses simpan galeri" }, { status: 500 });
  }
}

// 3. [DELETE] - API UNTUK MENGHAPUS FOTO DARI DATABASE & VERCEL BLOB
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ pesan: "ID tidak valid" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Ambil URL gambar dulu dari database sebelum barisnya dihapus
    const [foto] = await connection.execute("SELECT url_gambar FROM table_galeri WHERE id = ?", [id]);
    
    if (foto.length > 0 && foto[0].url_gambar) {
      try {
        // Hapus file dari Vercel Blob Storage biar gak nyampah
        await del(foto[0].url_gambar);
      } catch (blobErr) {
        console.log("Gagal hapus file di Vercel Blob, lanjut hapus DB:", blobErr);
      }
    }

    // Hapus data dari tabel TiDB
    await connection.execute("DELETE FROM table_galeri WHERE id = ?", [id]);
    await connection.end();

    return NextResponse.json({ pesan: "Foto berhasil dihapus!" }, { status: 200 });
  } catch (error) {
    console.error("API DELETE Galeri Error:", error);
    return NextResponse.json({ pesan: "Gagal menghapus foto" }, { status: 500 });
  }
}
