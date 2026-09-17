import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// 2. [GET] - API UNTUK MENGAMBIL DAFTAR FOTO KELUAR
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug"); // Menangkap ?slug=sd atau ?slug=all

    const connection = await mysql.createConnection(dbConfig);
    let query = "SELECT * FROM tabel_galeri ORDER BY id DESC";
    let values = [];

    // Kalau diakses dari admin lembaga tertentu (bukan super admin 'all')
    if (slug && slug !== "all") {
      query = "SELECT * FROM tabel_galeri WHERE slug_lembaga = ? ORDER BY id DESC";
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

// 3. [POST] - API UNTUK PROSES UPLOAD GAMBAR DAN SIMPAN DATABASE
export async function POST(request) {
  try {
    const formData = await request.formData();
    const aksi = formData.get("aksi");

    if (aksi === "simpan_galeri") {
      const slugLembaga = formData.get("slug_lembaga");
      const caption = formData.get("caption");
      const file = formData.get("image"); // Menangkap file gambar komputer

      if (!file) {
        return NextResponse.json({ pesan: "File foto tidak ditemukan" }, { status: 400 });
      }

      // --- PROSES SIMPAN FILE KE FOLDER 'public/uploads/' ---
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Bikin nama file unik biar gak bentrok (Contoh: 171829382-foto.jpg)
      const namaFileUnik = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      
      // Tentukan folder penyimpanan di project Next.js lo
      const direktoriUpload = path.join(process.cwd(), "public", "uploads");
      
      // Jaga-jaga kalau folder 'uploads' belum dibikin, otomatis dibuat sistem
      await fs.mkdir(direktoriUpload, { recursive: true });
      
      const pathLengkap = path.join(direktoriUpload, namaFileUnik);
      await fs.writeFile(pathLengkap, buffer);

      // Link URL gambar yang bakal disimpan ke MySQL (bisa diakses publik lewat web)
      const urlGambarFinal = `/uploads/${namaFileUnik}`;

      // --- SIMPAN DATA KE MYSQL ---
      const connection = await mysql.createConnection(dbConfig);
      const queryInsert = "INSERT INTO tabel_galeri (slug_lembaga, caption, url_gambar) VALUES (?, ?, ?)";
      await connection.execute(queryInsert, [slugLembaga, caption, urlGambarFinal]);
      await connection.end();

      return NextResponse.json({ pesan: "Berhasil menyimpan galeri!" }, { status: 201 });
    }

    return NextResponse.json({ pesan: "Aksi tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("API POST Galeri Error:", error);
    return NextResponse.json({ pesan: "Gagal memproses upload galeri" }, { status: 500 });
  }
}

// 4. [DELETE] - API UNTUK MENGHAPUS FOTO
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Menangkap ?id=5

    if (!id) {
      return NextResponse.json({ pesan: "ID tidak valid" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // [Opsional] Ambil dulu path gambarnya kalau lo mau hapus file fisiknya di folder uploads
    const [foto] = await connection.execute("SELECT url_gambar FROM tabel_galeri WHERE id = ?", [id]);
    if (foto.length > 0) {
      const pathFileFisik = path.join(process.cwd(), "public", foto[0].url_gambar);
      await fs.unlink(pathFileFisik).catch(() => console.log("File fisik gak ketemu, lewati hapus folder"));
    }

    // Hapus baris data di database
    await connection.execute("DELETE FROM tabel_galeri WHERE id = ?", [id]);
    await connection.end();

    return NextResponse.json({ pesan: "Foto berhasil dihapus!" }, { status: 200 });
  } catch (error) {
    console.error("API DELETE Galeri Error:", error);
    return NextResponse.json({ pesan: "Gagal menghapus foto" }, { status: 500 });
  }
}
