-- ==========================================
-- 易經卜卦網站 — Supabase 資料庫建表 SQL
-- ==========================================

-- 1. 卜卦記錄表
CREATE TABLE IF NOT EXISTS divination_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT DEFAULT '',
  hexagram_number INTEGER NOT NULL,
  hexagram_name TEXT NOT NULL,
  hexagram_symbol TEXT NOT NULL,
  changed_hexagram_number INTEGER,
  yao_values INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 建立索引
CREATE INDEX idx_records_user_id ON divination_records(user_id);
CREATE INDEX idx_records_created_at ON divination_records(created_at DESC);

-- 3. 啟用 Row Level Security (RLS)
ALTER TABLE divination_records ENABLE ROW LEVEL SECURITY;

-- 4. RLS 政策：用戶只能存取自己的記錄
-- 查詢
CREATE POLICY "Users can view own records"
  ON divination_records FOR SELECT
  USING (auth.uid() = user_id);

-- 新增
CREATE POLICY "Users can insert own records"
  ON divination_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 刪除
CREATE POLICY "Users can delete own records"
  ON divination_records FOR DELETE
  USING (auth.uid() = user_id);

-- 5. 允許匿名用戶（未登入）也能新增記錄
-- 匿名記錄的 user_id 為 NULL
CREATE POLICY "Anonymous can insert records"
  ON divination_records FOR INSERT
  WITH CHECK (user_id IS NULL);

-- 匿名記錄可由 session 透過 id 查詢
CREATE POLICY "Anonymous can view by id"
  ON divination_records FOR SELECT
  USING (user_id IS NULL);

CREATE POLICY "Anonymous can delete own records"
  ON divination_records FOR DELETE
  USING (user_id IS NULL);
