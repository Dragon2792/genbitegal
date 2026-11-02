"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  importAnggota,
  type DuplicateStrategy,
  type ImportAnggotaResult,
  type ImportAnggotaRowInput,
} from "../actions";

interface KelasItem {
  kelas_id: number;
  kelas_nama: string;
}

interface RawParsedRow {
  id: string;
  excelRowNumber: number;
  rawNis: string;
  rawNama: string;
  rawJenkel: string;
  rawKelas: string;
  rawPhoto: string;
}

interface EvaluatedRow extends RawParsedRow {
  nis: string;
  nama: string;
  jenkel: "L" | "P" | null;
  kelasId: number | null;
  kelasNama: string | null;
  photo: string | null;
  isDuplicateDb: boolean;
  isDuplicateBatch: boolean;
  status: "ready" | "update" | "skip" | "error";
  statusLabel: string;
  errors: string[];
}

const NIS_HEADERS = new Set([
  "nis",
  "nim",
  "nisn",
  "nomor induk",
  "no induk",
  "nomor induk siswa",
  "nomor induk mahasiswa",
  "nis nim",
  "nim nis",
  "id anggota",
  "siswa nis",
]);

const NAMA_HEADERS = new Set([
  "nama",
  "nama lengkap",
  "nama anggota",
  "nama mahasiswa",
  "nama siswa",
  "full name",
  "name",
  "siswa nama",
]);

const JENKEL_HEADERS = new Set([
  "jenis kelamin",
  "jenkel",
  "kelamin",
  "jk",
  "l p",
  "lp",
  "gender",
  "sex",
  "siswa jenkel",
]);

const KELAS_HEADERS = new Set([
  "komisariat",
  "kelas",
  "nama komisariat",
  "nama kelas",
  "universitas",
  "kampus",
  "asal kampus",
  "perguruan tinggi",
  "instansi",
  "id kelas",
  "kelas id",
  "siswa kelas id",
]);

const FOTO_HEADERS = new Set([
  "foto",
  "photo",
  "pas foto",
  "url foto",
  "file foto",
  "gambar",
  "siswa photo",
  "foto opsional",
]);

function normalizeHeader(val: string): string {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCellString(cell: XLSX.CellObject | undefined): string {
  if (!cell || cell.v === undefined || cell.v === null) return "";
  if (cell.t === "n" && typeof cell.v === "number") {
    if (cell.w && /^0\d+$/.test(cell.w.trim())) {
      return cell.w.trim();
    }
    if (Number.isInteger(cell.v)) {
      return cell.v.toString();
    }
    return String(cell.v);
  }
  const str = String(cell.v).trim();
  return str.startsWith("'") ? str.slice(1).trim() : str;
}

function parseGender(raw: string): "L" | "P" | null {
  const norm = raw
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!norm) return null;
  if (
    ["l", "laki laki", "laki", "pria", "male", "m", "lk", "cowo", "cowok"].includes(
      norm
    )
  ) {
    return "L";
  }
  if (
    [
      "p",
      "perempuan",
      "wanita",
      "female",
      "f",
      "w",
      "pr",
      "cewe",
      "cewek",
    ].includes(norm)
  ) {
    return "P";
  }
  return null;
}

function resolveKelas(
  rawKelas: string,
  defaultKelasId: number,
  kelasList: KelasItem[]
): KelasItem | null {
  const trimmed = rawKelas.trim();
  if (!trimmed) {
    if (defaultKelasId > 0) {
      return kelasList.find((k) => k.kelas_id === defaultKelasId) || null;
    }
    return null;
  }

  // 1. Cek jika berupa angka ID kelas
  if (/^\d+$/.test(trimmed)) {
    const idNum = parseInt(trimmed, 10);
    const byId = kelasList.find((k) => k.kelas_id === idNum);
    if (byId) return byId;
  }

  const norm = normalizeHeader(trimmed);

  // 2. Exact match nama kelas/komisariat
  const exact = kelasList.find((k) => normalizeHeader(k.kelas_nama) === norm);
  if (exact) return exact;

  // 3. Alias umum kampus GenBI Tegal
  if (
    norm.includes("uin") ||
    norm.includes("gusdur") ||
    norm.includes("abdurrahman wahid") ||
    norm.includes("iain")
  ) {
    const match = kelasList.find((k) =>
      normalizeHeader(k.kelas_nama).includes("uin")
    );
    if (match) return match;
  }
  if (norm.includes("ups") || norm.includes("pancasakti")) {
    const match = kelasList.find((k) => {
      const kn = normalizeHeader(k.kelas_nama);
      return kn.includes("ups") || kn.includes("pancasakti");
    });
    if (match) return match;
  }
  if (norm.includes("unikal") || norm.includes("universitas pekalongan")) {
    const match = kelasList.find((k) => {
      const kn = normalizeHeader(k.kelas_nama);
      return kn.includes("unikal") || kn.includes("universitas pekalongan");
    });
    if (match) return match;
  }
  if (
    norm.includes("uibn") ||
    norm === "ibn" ||
    norm.includes("ibn tegal") ||
    norm.includes("bakti negara")
  ) {
    const match = kelasList.find((k) => {
      const kn = normalizeHeader(k.kelas_nama);
      return (
        kn.includes("uibn") || kn.includes("ibn") || kn.includes("bakti negara")
      );
    });
    if (match) return match;
  }
  if (norm.includes("korkom")) {
    const match = kelasList.find((k) =>
      normalizeHeader(k.kelas_nama).includes("korkom")
    );
    if (match) return match;
  }

  // 4. Partial match jika cukup spesifik (>= 3 karakter)
  if (norm.length >= 3) {
    const partial = kelasList.find((k) => {
      const kn = normalizeHeader(k.kelas_nama);
      return kn.includes(norm) || norm.includes(kn);
    });
    if (partial) return partial;
  }

  return null;
}

export default function ImportAnggotaClient({
  kelasList,
  existingNisList,
}: {
  kelasList: KelasItem[];
  existingNisList: string[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [rawRows, setRawRows] = useState<RawParsedRow[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  const [defaultKelasId, setDefaultKelasId] = useState<number>(0);
  const [duplicateStrategy, setDuplicateStrategy] =
    useState<DuplicateStrategy>("skip");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<ImportAnggotaResult | null>(
    null
  );
  const [knownExistingNis, setKnownExistingNis] = useState<string[]>(
    existingNisList
  );

  const existingNisSet = useMemo(
    () => new Set(knownExistingNis.map((n) => n.trim().toLowerCase())),
    [knownExistingNis]
  );

  const extractRowsFromSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    setParseError(null);
    setImportResult(null);
    setExcludedIds(new Set());

    const ws = wb.Sheets[sheetName];
    if (!ws || !ws["!ref"]) {
      setRawRows([]);
      setParseError("Sheet Excel kosong atau tidak memiliki data.");
      return;
    }

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const maxScanRow = Math.min(range.e.r, range.s.r + 12);

    let headerRowIdx = -1;
    let colMap = {
      nis: -1,
      nama: -1,
      jenkel: -1,
      kelas: -1,
      photo: -1,
    };

    for (let r = range.s.r; r <= maxScanRow; r++) {
      const candidate = { nis: -1, nama: -1, jenkel: -1, kelas: -1, photo: -1 };
      let matchedCount = 0;

      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const rawVal = getCellString(ws[addr]);
        if (!rawVal) continue;
        const norm = normalizeHeader(rawVal);

        if (candidate.nis === -1 && NIS_HEADERS.has(norm)) {
          candidate.nis = c;
          matchedCount++;
        } else if (candidate.nama === -1 && NAMA_HEADERS.has(norm)) {
          candidate.nama = c;
          matchedCount++;
        } else if (candidate.jenkel === -1 && JENKEL_HEADERS.has(norm)) {
          candidate.jenkel = c;
          matchedCount++;
        } else if (candidate.kelas === -1 && KELAS_HEADERS.has(norm)) {
          candidate.kelas = c;
          matchedCount++;
        } else if (candidate.photo === -1 && FOTO_HEADERS.has(norm)) {
          candidate.photo = c;
        }
      }

      if (matchedCount >= 2 || (candidate.nama !== -1 && matchedCount >= 1)) {
        headerRowIdx = r;
        colMap = candidate;
        break;
      }
    }

    if (headerRowIdx === -1) {
      setRawRows([]);
      setParseError(
        "Header tabel tidak dikenali. Pastikan baris judul kolom memiliki kolom 'NIS' (atau NIM), 'Nama Lengkap', 'Jenis Kelamin' (L/P), dan 'Komisariat' (atau Kelas). Anda dapat mengunduh Template Excel di atas sebagai acuan."
      );
      return;
    }

    const missingCols: string[] = [];
    if (colMap.nis === -1) missingCols.push("NIS / NIM");
    if (colMap.nama === -1) missingCols.push("Nama Lengkap");
    if (colMap.jenkel === -1) missingCols.push("Jenis Kelamin (L/P)");

    if (missingCols.length > 0) {
      setRawRows([]);
      setParseError(
        `Kolom wajib belum ditemukan pada file Excel: ${missingCols.join(", ")}.`
      );
      return;
    }

    const parsed: RawParsedRow[] = [];
    for (let r = headerRowIdx + 1; r <= range.e.r; r++) {
      const rawNis =
        colMap.nis !== -1
          ? getCellString(ws[XLSX.utils.encode_cell({ r, c: colMap.nis })])
          : "";
      const rawNama =
        colMap.nama !== -1
          ? getCellString(ws[XLSX.utils.encode_cell({ r, c: colMap.nama })])
          : "";
      const rawJenkel =
        colMap.jenkel !== -1
          ? getCellString(ws[XLSX.utils.encode_cell({ r, c: colMap.jenkel })])
          : "";
      const rawKelas =
        colMap.kelas !== -1
          ? getCellString(ws[XLSX.utils.encode_cell({ r, c: colMap.kelas })])
          : "";
      const rawPhoto =
        colMap.photo !== -1
          ? getCellString(ws[XLSX.utils.encode_cell({ r, c: colMap.photo })])
          : "";

      // Lewati baris yang benar-benar kosong
      if (!rawNis && !rawNama && !rawJenkel && !rawKelas && !rawPhoto) {
        continue;
      }

      parsed.push({
        id: `row-${r}`,
        excelRowNumber: r + 1,
        rawNis,
        rawNama,
        rawJenkel,
        rawKelas,
        rawPhoto,
      });
    }

    if (parsed.length === 0) {
      setRawRows([]);
      setParseError("File Excel tidak memiliki baris data di bawah header.");
      return;
    }

    setRawRows(parsed);
  };

  const handleFile = async (file: File) => {
    setParseError(null);
    setImportResult(null);

    const validExt = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!validExt) {
      setParseError(
        "Format file tidak didukung. Gunakan file Excel (.xlsx, .xls) atau .csv."
      );
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array", cellDates: false });

      const usableSheets = wb.SheetNames.filter(
        (name) => !name.toLowerCase().includes("referensi")
      );
      const sheets = usableSheets.length > 0 ? usableSheets : wb.SheetNames;

      if (sheets.length === 0) {
        setParseError("File Excel tidak memiliki worksheet.");
        return;
      }

      setFileName(file.name);
      setWorkbook(wb);
      setSheetNames(wb.SheetNames);
      setSelectedSheet(sheets[0]);
      extractRowsFromSheet(wb, sheets[0]);
    } catch (err) {
      console.error("Failed reading excel:", err);
      setParseError(
        "Gagal membaca file Excel. Pastikan file tidak rusak atau terkunci password."
      );
    }
  };

  const handleSheetChange = (newSheet: string) => {
    setSelectedSheet(newSheet);
    if (workbook) {
      extractRowsFromSheet(workbook, newSheet);
    }
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    const sampleKom1 = kelasList[0]?.kelas_nama || "UIN Pekalongan";
    const sampleKom2 = kelasList[1]?.kelas_nama || sampleKom1;

    const templateAoA = [
      [
        "NIS",
        "Nama Lengkap",
        "Jenis Kelamin",
        "Komisariat",
        "Foto (Opsional)",
      ],
      ["0222057091", "Ahmad Fauzi", "L", sampleKom1, ""],
      ["2222600038", "Siti Nurhaliza", "P", sampleKom2, ""],
    ];

    const wsData = XLSX.utils.aoa_to_sheet(templateAoA);

    // Pastikan sel contoh NIS bertipe string ('@') agar angka 0 di depan tidak hilang di Excel
    ["A2", "A3"].forEach((addr) => {
      if (wsData[addr]) {
        wsData[addr].t = "s";
        wsData[addr].z = "@";
      }
    });

    wsData["!cols"] = [
      { wch: 18 },
      { wch: 30 },
      { wch: 16 },
      { wch: 26 },
      { wch: 24 },
    ];

    XLSX.utils.book_append_sheet(wb, wsData, "Data Anggota");

    // Sheet 2: Referensi Komisariat & Petunjuk
    const refAoA: (string | number)[][] = [
      ["DAFTAR REFERENSI KOMISARIAT / KELAS"],
      ["ID Kelas", "Nama Komisariat / Kelas"],
      ...kelasList.map((k) => [k.kelas_id, k.kelas_nama]),
      [],
      ["PETUNJUK PENGISIAN"],
      ["Kolom", "Keterangan"],
      ["NIS", "Wajib diisi (NIS / NIM anggota, maks. 20 karakter). Gunakan tanda kutip satu (') di awal jika ada angka 0 di depan, misal '0222057091."],
      ["Nama Lengkap", "Wajib diisi (maks. 70 karakter)."],
      ["Jenis Kelamin", "Wajib diisi: L (atau Laki-laki) / P (atau Perempuan)."],
      ["Komisariat", "Isi sesuai Nama Komisariat pada tabel di atas, atau pilih Komisariat Default saat upload."],
      ["Foto (Opsional)", "Kosongkan jika belum ada foto. Sistem otomatis menggunakan avatar default."],
    ];

    const wsRef = XLSX.utils.aoa_to_sheet(refAoA);
    wsRef["!cols"] = [{ wch: 20 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsRef, "Referensi Komisariat");

    XLSX.writeFile(wb, "Template_Import_Anggota_GenBI.xlsx");
  };

  const evaluatedRows: EvaluatedRow[] = useMemo(() => {
    const seenNisInBatch = new Set<string>();

    return rawRows.map((row) => {
      const isExcluded = excludedIds.has(row.id);
      const errors: string[] = [];

      const nis = row.rawNis.trim();
      const nama = row.rawNama.trim();
      const jenkel = parseGender(row.rawJenkel);
      const resolvedKelas = resolveKelas(
        row.rawKelas,
        defaultKelasId,
        kelasList
      );
      const photo = row.rawPhoto.trim() || null;

      if (!nis) {
        errors.push("NIS/NIM wajib diisi");
      } else if (nis.length > 20) {
        errors.push(`NIS terlalu panjang (${nis.length}/20 karakter)`);
      }

      if (!nama) {
        errors.push("Nama lengkap wajib diisi");
      } else if (nama.length > 70) {
        errors.push(`Nama terlalu panjang (${nama.length}/70 karakter)`);
      }

      if (!jenkel) {
        errors.push(
          row.rawJenkel
            ? `Jenis kelamin "${row.rawJenkel}" tidak valid (gunakan L atau P)`
            : "Jenis kelamin wajib diisi (L/P)"
        );
      }

      if (!resolvedKelas) {
        errors.push(
          row.rawKelas
            ? `Komisariat "${row.rawKelas}" tidak ditemukan`
            : "Komisariat kosong (isi di Excel atau pilih Komisariat Default)"
        );
      }

      const nisKey = nis.toLowerCase();
      const isDuplicateDb = nis.length > 0 && existingNisSet.has(nisKey);
      let isDuplicateBatch = false;

      if (!isExcluded && nis.length > 0) {
        if (seenNisInBatch.has(nisKey)) {
          isDuplicateBatch = true;
        } else {
          seenNisInBatch.add(nisKey);
        }
      }

      let status: EvaluatedRow["status"] = "ready";
      let statusLabel = "Siap Ditambahkan";

      if (errors.length > 0) {
        status = "error";
        statusLabel = errors[0];
      } else if (duplicateStrategy === "skip" && (isDuplicateDb || isDuplicateBatch)) {
        status = "skip";
        statusLabel = isDuplicateDb
          ? "Dilewati (NIS sudah terdaftar)"
          : "Dilewati (NIS ganda di Excel)";
      } else if (duplicateStrategy === "update" && isDuplicateDb) {
        status = "update";
        statusLabel = "Akan Diperbarui (Update)";
      } else if (duplicateStrategy === "update" && isDuplicateBatch) {
        status = "update";
        statusLabel = "Baris terbaru dipakai";
      }

      return {
        ...row,
        nis,
        nama,
        jenkel,
        kelasId: resolvedKelas?.kelas_id ?? null,
        kelasNama: resolvedKelas?.kelas_nama ?? null,
        photo,
        isDuplicateDb,
        isDuplicateBatch,
        status,
        statusLabel,
        errors,
      };
    });
  }, [rawRows, excludedIds, defaultKelasId, kelasList, existingNisSet, duplicateStrategy]);

  const activeRows = useMemo(
    () => evaluatedRows.filter((r) => !excludedIds.has(r.id)),
    [evaluatedRows, excludedIds]
  );

  const summary = useMemo(() => {
    let readyCount = 0;
    let updateCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const r of activeRows) {
      if (r.status === "ready") readyCount++;
      else if (r.status === "update") updateCount++;
      else if (r.status === "skip") skipCount++;
      else if (r.status === "error") errorCount++;
    }

    return {
      total: activeRows.length,
      readyCount,
      updateCount,
      skipCount,
      errorCount,
      actionableCount: readyCount + updateCount,
    };
  }, [activeRows]);

  const toggleExcludeRow = (id: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFile = () => {
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet("");
    setFileName("");
    setRawRows([]);
    setExcludedIds(new Set());
    setParseError(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitImport = async () => {
    const validToSubmit: ImportAnggotaRowInput[] = activeRows
      .filter((r) => r.status === "ready" || r.status === "update")
      .map((r) => ({
        nis: r.nis,
        nama: r.nama,
        jenkel: r.jenkel as "L" | "P",
        kelas_id: r.kelasId as number,
        photo: r.photo,
      }));

    if (validToSubmit.length === 0) return;

    setIsSubmitting(true);
    setImportResult(null);

    try {
      const res = await importAnggota(validToSubmit, duplicateStrategy);
      setImportResult(res);

      if (res.success) {
        // Tambahkan NIS yang baru diinsert ke daftar existing agar status langsung sinkron
        const importedNis = validToSubmit.map((r) => r.nis);
        setKnownExistingNis((prev) => Array.from(new Set([...prev, ...importedNis])));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setImportResult({
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errors: ["Terjadi kesalahan jaringan saat menghubungi server."],
        message: "Gagal mengimport data anggota.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Panduan & Download Template */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Format & Template Excel Anggota
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Unduh template resmi agar susunan kolom dan nama komisariat sesuai dengan database.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <Download size={16} />
            Download Template Excel (.xlsx)
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4">
            <p className="font-semibold text-blue-900 flex items-center gap-1.5 mb-2">
              <Info size={15} className="text-blue-600" />
              Kolom yang Didukung:
            </p>
            <ul className="space-y-1 text-gray-700 text-xs leading-relaxed">
              <li>
                <span className="font-semibold text-gray-900">NIS / NIM</span> (Wajib) — Nomor Induk Anggota, maks. 20 karakter.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Nama Lengkap</span> (Wajib) — Nama lengkap anggota, maks. 70 karakter.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Jenis Kelamin</span> (Wajib) — Isi <code className="px-1 py-0.5 bg-white rounded border border-blue-200">L</code> / <code className="px-1 py-0.5 bg-white rounded border border-blue-200">Laki-laki</code> atau <code className="px-1 py-0.5 bg-white rounded border border-blue-200">P</code> / <code className="px-1 py-0.5 bg-white rounded border border-blue-200">Perempuan</code>.
              </li>
              <li>
                <span className="font-semibold text-gray-900">Komisariat / Kelas</span> — Nama komisariat (atau pilih Komisariat Default di bawah).
              </li>
              <li>
                <span className="font-semibold text-gray-900">Foto</span> (Opsional) — Kosongkan jika menggunakan foto avatar default.
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-800 mb-2">
              Daftar Komisariat / Kelas Terdaftar:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {kelasList.map((k) => (
                <span
                  key={k.kelas_id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700"
                >
                  <span className="text-blue-600 font-bold">#{k.kelas_id}</span>
                  {k.kelas_nama}
                </span>
              ))}
              {kelasList.length === 0 && (
                <span className="text-xs text-gray-500">
                  Belum ada data kelas/komisariat di database.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pengaturan & Upload File */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="defaultKelas"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Komisariat / Kelas Default (Opsional)
            </label>
            <select
              id="defaultKelas"
              value={defaultKelasId}
              onChange={(e) => setDefaultKelasId(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 border bg-white"
            >
              <option value={0}>— Otomatis dari kolom Komisariat di Excel —</option>
              {kelasList.map((k) => (
                <option key={k.kelas_id} value={k.kelas_id}>
                  {k.kelas_nama}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Digunakan otomatis jika kolom Komisariat pada file Excel dikosongkan atau tidak tersedia.
            </p>
          </div>

          <div>
            <label
              htmlFor="duplicateStrategy"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Jika NIS / NIM Sudah Terdaftar
            </label>
            <select
              id="duplicateStrategy"
              value={duplicateStrategy}
              onChange={(e) =>
                setDuplicateStrategy(e.target.value as DuplicateStrategy)
              }
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 border bg-white"
            >
              <option value="skip">
                Lewati baris yang NIS-nya sudah terdaftar (Disarankan)
              </option>
              <option value="update">
                Perbarui (Update) data anggota dengan NIS yang sama
              </option>
              <option value="insert">
                Tetap tambahkan sebagai anggota baru
              </option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Mengatur cara sistem menangani data anggota yang memiliki NIS sama di database.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50/60"
                : fileName
                ? "border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Upload size={22} />
            </div>
            {fileName ? (
              <div>
                <p className="text-sm font-semibold text-gray-800">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Klik atau seret file lain ke sini untuk mengganti file Excel
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Klik untuk memilih file Excel atau seret file ke area ini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Mendukung format .xlsx, .xls, dan .csv
                </p>
              </div>
            )}
          </div>

          {sheetNames.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Pilih Sheet Excel:
              </label>
              <select
                value={selectedSheet}
                onChange={(e) => handleSheetChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sheetNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Parse Error Banner */}
        {parseError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">File Tidak Dapat Diproses</p>
              <p className="mt-0.5 text-red-600">{parseError}</p>
            </div>
          </div>
        )}

        {/* Import Result Banner */}
        {importResult && (
          <div
            className={`p-5 rounded-xl border ${
              importResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle2
                    size={22}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                ) : (
                  <AlertCircle
                    size={22}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                )}
                <div>
                  <p className="font-bold text-base">
                    {importResult.success
                      ? "Import Data Anggota Berhasil!"
                      : "Import Gagal"}
                  </p>
                  <p className="text-sm mt-0.5">{importResult.message}</p>
                  {importResult.errors.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-xs space-y-0.5 opacity-90">
                      {importResult.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {importResult.errors.length > 5 && (
                        <li>
                          ...dan {importResult.errors.length - 5} catatan lainnya.
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {importResult.success && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={resetFile}
                    className="px-3.5 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Import File Lain
                  </button>
                  <Link
                    href="/admin/anggota"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    Lihat Daftar Anggota →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview Table */}
      {evaluatedRows.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Pratinjau Data Import ({activeRows.length} baris aktif)
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={13} />
                  Baru: {summary.readyCount}
                </span>
                {summary.updateCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <RefreshCw size={13} />
                    Update: {summary.updateCount}
                  </span>
                )}
                {summary.skipCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle size={13} />
                    Dilewati: {summary.skipCount}
                  </span>
                )}
                {summary.errorCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={13} />
                    Bermasalah: {summary.errorCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={resetFile}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Reset File
              </button>
              <button
                type="button"
                onClick={handleSubmitImport}
                disabled={isSubmitting || summary.actionableCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Mengimport Data...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import {summary.actionableCount} Anggota Sekarang
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-16">
                    Baris
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    NIS / NIM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Nama Lengkap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-28">
                    L/P
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Komisariat / Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-20">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluatedRows.map((row) => {
                  const isExcluded = excludedIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isExcluded
                          ? "bg-gray-50/80 opacity-45"
                          : row.status === "error"
                          ? "bg-red-50/30 hover:bg-red-50/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                        #{row.excelRowNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {row.nis || (
                          <span className="text-red-500 italic text-xs">
                            Kosong
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {row.nama || (
                          <span className="text-red-500 italic text-xs">
                            Kosong
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.jenkel ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.jenkel === "L"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-pink-50 text-pink-700"
                            }`}
                          >
                            {row.jenkel === "L" ? "Laki-laki" : "Perempuan"}
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-medium">
                            {row.rawJenkel || "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.kelasNama ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                            {row.kelasNama}
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs">
                            {row.rawKelas || "Belum dipilih"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isExcluded ? (
                          <span className="text-xs text-gray-500 italic">
                            Dikecualikan manual
                          </span>
                        ) : row.status === "ready" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={14} /> {row.statusLabel}
                          </span>
                        ) : row.status === "update" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                            <RefreshCw size={14} /> {row.statusLabel}
                          </span>
                        ) : row.status === "skip" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                            <AlertTriangle size={14} /> {row.statusLabel}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                            <AlertCircle size={14} /> {row.statusLabel}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleExcludeRow(row.id)}
                          title={
                            isExcluded
                              ? "Sertakan kembali baris ini"
                              : "Hapus/kecualikan baris ini dari import"
                          }
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            isExcluded
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold px-2"
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {isExcluded ? "Pulihkan" : <Trash2 size={15} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div>
        <Link
          href="/admin/anggota"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Manajemen Anggota
        </Link>
      </div>
    </div>
  );
}

