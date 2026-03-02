// Generate SQL to create hexagrams table and insert all 64 hexagrams into Supabase
const fs = require('fs');
const path = require('path');

// We need to read the hexagrams data from the generated JS file
// Parse the HEXAGRAMS array from hexagrams.js
const jsContent = fs.readFileSync(path.join(__dirname, '../src/data/hexagrams.js'), 'utf-8');

// Extract the array part
const startIdx = jsContent.indexOf('const HEXAGRAMS = [');
const endIdx = jsContent.indexOf('];', startIdx) + 2;
const arrayStr = jsContent.substring(startIdx, endIdx);

// Eval in a controlled way to get the data
const HEXAGRAMS = eval(arrayStr.replace('const HEXAGRAMS = ', ''));

function escapeSQL(str) {
    if (!str) return '';
    return str.replace(/'/g, "''");
}

let sql = `-- ==========================================
-- 易經六十四卦資料表 — Supabase Schema + Seed
-- ==========================================

-- 1. 建立 hexagrams 資料表
CREATE TABLE IF NOT EXISTS hexagrams (
  id SERIAL PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  symbol TEXT NOT NULL,
  upper_trigram TEXT NOT NULL,
  lower_trigram TEXT NOT NULL,
  binary_repr TEXT NOT NULL,
  gua_ci TEXT DEFAULT '',
  tuan_zhuan TEXT DEFAULT '',
  xiang_zhuan TEXT DEFAULT '',
  description TEXT DEFAULT '',
  yao JSONB DEFAULT '[]'
);

-- 2. 建立索引
CREATE INDEX idx_hexagrams_number ON hexagrams(number);
CREATE INDEX idx_hexagrams_binary ON hexagrams(binary_repr);

-- 3. 啟用 RLS 並允許所有人讀取（公開資料）
ALTER TABLE hexagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hexagrams are publicly readable"
  ON hexagrams FOR SELECT
  USING (true);

-- 4. 插入六十四卦資料
`;

for (const h of HEXAGRAMS) {
    const yaoJson = JSON.stringify(h.yao || []);
    sql += `INSERT INTO hexagrams (number, name_zh, name_en, symbol, upper_trigram, lower_trigram, binary_repr, gua_ci, tuan_zhuan, xiang_zhuan, description, yao) VALUES (${h.n}, '${escapeSQL(h.zh)}', '${escapeSQL(h.en)}', '${escapeSQL(h.sym)}', '${escapeSQL(h.up)}', '${escapeSQL(h.lo)}', '${h.bin}', '${escapeSQL(h.gc)}', '${escapeSQL(h.tz)}', '${escapeSQL(h.xz)}', '${escapeSQL(h.desc)}', '${escapeSQL(yaoJson)}');\n`;
}

const outPath = path.join(__dirname, '../supabase/hexagrams_seed.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`✅ Generated ${outPath}`);
console.log(`   ${HEXAGRAMS.length} hexagrams`);
