#!/bin/bash
# ==============================================
# Script Deploy GenBI Next.js ke cPanel via SSH
# Jalankan di SERVER (setelah SSH ke cPanel)
# ==============================================

# === KONFIGURASI — Sesuaikan ini ===
APP_DIR="$HOME/genbi-nextjs"
DB_USER="USERNAME_DB"        # ← Ganti dengan username MySQL cPanel
DB_PASS="PASSWORD_DB"        # ← Ganti dengan password MySQL cPanel
DB_NAME="u5329574_genbi"
APP_URL="https://genbitegal.com"
SECRET="genbi_tegal_secret_key_production_2024_ganti_ini"  # ← Ganti!

echo "===================================="
echo " GenBI Next.js — Server Setup Script"
echo "===================================="

# 1. Buat folder aplikasi
echo "📁 Membuat folder aplikasi..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# 2. Buat file .env
echo "⚙️  Membuat file .env..."
cat > .env << EOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}"
NEXTAUTH_SECRET="${SECRET}"
NEXTAUTH_URL="${APP_URL}"
NODE_ENV="production"
EOF
echo "✅ .env dibuat"

# 3. Install dependencies
echo "📦 Menginstall dependencies..."
npm install --production --no-audit --no-fund
echo "✅ Dependencies terinstall"

# 4. Generate Prisma Client
echo "🔧 Generate Prisma Client..."
npx prisma generate
echo "✅ Prisma Client siap"

echo ""
echo "===================================="
echo " Setup selesai!"
echo " Sekarang kembali ke cPanel:"
echo " Setup Node.js App → Restart App"
echo "===================================="
