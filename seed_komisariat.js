const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    komisariat_nama: "Universitas Pancasakti Tegal",
    komisariat_short: "UPS",
    komisariat_logo: "8b9758201bcbd888894c0c9a6c21fdb3.png",
    komisariat_ketua: "Erna Sundari",
    komisariat_desc: "GenBI Komisariat UPS aktif dalam kegiatan pelestarian lingkungan dan pendidikan. Berlokasi di kampus pusat Tegal, komisariat ini telah menyelenggarakan berbagai seminar nasional dan pengabdian masyarakat.",
    komisariat_members: "45+",
    komisariat_proker: "12",
    komisariat_awards: "3",
    komisariat_ig: "@genbi_ups",
    komisariat_web: "upstegal.ac.id",
    komisariat_urutan: 1,
  },
  {
    komisariat_nama: "Universitas Pekalongan",
    komisariat_short: "UNIKAL",
    komisariat_logo: "1a8ddb5eefe3a5e39d1eb3f36694adbe.jpg",
    komisariat_ketua: "Retno Dwitasari",
    komisariat_desc: "Berbasis di Kota Pekalongan, GenBI Komisariat UNIKAL memfokuskan program kerjanya pada pemberdayaan UMKM lokal dan literasi keuangan digital bagi masyarakat pesisir.",
    komisariat_members: "38+",
    komisariat_proker: "15",
    komisariat_awards: "5",
    komisariat_ig: "@genbi_unikal",
    komisariat_web: "unikal.ac.id",
    komisariat_urutan: 2,
  },
  {
    komisariat_nama: "UIN KH. Abdurrahman Wahid Pekalongan",
    komisariat_short: "UIN GUSDUR",
    komisariat_logo: "logo-uingusdur.jpg",
    komisariat_ketua: "Fadila Arifatu Khasanah",
    komisariat_desc: "Komisariat yang unggul dalam integrasi nilai-nilai keislaman dengan literasi kebanksentralan. Aktif melakukan sosialisasi QRIS di lingkungan pondok pesantren.",
    komisariat_members: "50+",
    komisariat_proker: "18",
    komisariat_awards: "4",
    komisariat_ig: "@genbi_uingusdur",
    komisariat_web: "uingusdur.ac.id",
    komisariat_urutan: 3,
  },
  {
    komisariat_nama: "Universitas Islam Bakti Negara Tegal",
    komisariat_short: "UIBN",
    komisariat_logo: "logo-ibn.jpg",
    komisariat_ketua: "Rizky Dwi Baybakti",
    komisariat_desc: "GenBI UIBN menitikberatkan pada pengembangan ekonomi kreatif mahasiswa dan pendampingan sertifikasi halal bagi pelaku usaha mikro di Kabupaten Tegal.",
    komisariat_members: "30+",
    komisariat_proker: "10",
    komisariat_awards: "2",
    komisariat_ig: "@genbi_uibn",
    komisariat_web: "uibntegal.ac.id",
    komisariat_urutan: 4,
  },
];

async function main() {
  console.log("Seeding komisariat...");
  for (const item of data) {
    await prisma.tbl_komisariat.create({
      data: item
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
