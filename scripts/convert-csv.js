// Script to convert IChingData.csv to hexagrams.js format
const fs = require('fs');
const path = require('path');

const csv = fs.readFileSync(path.join(__dirname, '../src/IChingData.csv'), 'utf-8');

// The existing binary mappings and metadata from constants.js (top-to-bottom binary: bin[0]=上爻)
const HEXAGRAM_META = [
    { n: 1, zh: '乾', en: 'Qián', sym: '䷀', up: '乾/天', lo: '乾/天', bin: '111111' },
    { n: 2, zh: '坤', en: 'Kūn', sym: '䷁', up: '坤/地', lo: '坤/地', bin: '000000' },
    { n: 3, zh: '屯', en: 'Zhūn', sym: '䷂', up: '坎/水', lo: '震/雷', bin: '010001' },
    { n: 4, zh: '蒙', en: 'Méng', sym: '䷃', up: '艮/山', lo: '坎/水', bin: '100010' },
    { n: 5, zh: '需', en: 'Xū', sym: '䷄', up: '坎/水', lo: '乾/天', bin: '010111' },
    { n: 6, zh: '訟', en: 'Sòng', sym: '䷅', up: '乾/天', lo: '坎/水', bin: '111010' },
    { n: 7, zh: '師', en: 'Shī', sym: '䷆', up: '坤/地', lo: '坎/水', bin: '000010' },
    { n: 8, zh: '比', en: 'Bǐ', sym: '䷇', up: '坎/水', lo: '坤/地', bin: '010000' },
    { n: 9, zh: '小畜', en: 'Xiǎo Chù', sym: '䷈', up: '巽/風', lo: '乾/天', bin: '110111' },
    { n: 10, zh: '履', en: 'Lǚ', sym: '䷉', up: '乾/天', lo: '兌/澤', bin: '111011' },
    { n: 11, zh: '泰', en: 'Tài', sym: '䷊', up: '坤/地', lo: '乾/天', bin: '000111' },
    { n: 12, zh: '否', en: 'Pǐ', sym: '䷋', up: '乾/天', lo: '坤/地', bin: '111000' },
    { n: 13, zh: '同人', en: 'Tóng Rén', sym: '䷌', up: '乾/天', lo: '離/火', bin: '111101' },
    { n: 14, zh: '大有', en: 'Dà Yǒu', sym: '䷍', up: '離/火', lo: '乾/天', bin: '101111' },
    { n: 15, zh: '謙', en: 'Qiān', sym: '䷎', up: '坤/地', lo: '艮/山', bin: '000100' },
    { n: 16, zh: '豫', en: 'Yù', sym: '䷏', up: '震/雷', lo: '坤/地', bin: '001000' },
    { n: 17, zh: '隨', en: 'Suí', sym: '䷐', up: '兌/澤', lo: '震/雷', bin: '011001' },
    { n: 18, zh: '蠱', en: 'Gǔ', sym: '䷑', up: '艮/山', lo: '巽/風', bin: '100110' },
    { n: 19, zh: '臨', en: 'Lín', sym: '䷒', up: '坤/地', lo: '兌/澤', bin: '000011' },
    { n: 20, zh: '觀', en: 'Guān', sym: '䷓', up: '巽/風', lo: '坤/地', bin: '110000' },
    { n: 21, zh: '噬嗑', en: 'Shì Kè', sym: '䷔', up: '離/火', lo: '震/雷', bin: '101001' },
    { n: 22, zh: '賁', en: 'Bì', sym: '䷕', up: '艮/山', lo: '離/火', bin: '100101' },
    { n: 23, zh: '剝', en: 'Bō', sym: '䷖', up: '艮/山', lo: '坤/地', bin: '100000' },
    { n: 24, zh: '復', en: 'Fù', sym: '䷗', up: '坤/地', lo: '震/雷', bin: '000001' },
    { n: 25, zh: '無妄', en: 'Wú Wàng', sym: '䷘', up: '乾/天', lo: '震/雷', bin: '111001' },
    { n: 26, zh: '大畜', en: 'Dà Chù', sym: '䷙', up: '艮/山', lo: '乾/天', bin: '100111' },
    { n: 27, zh: '頤', en: 'Yí', sym: '䷚', up: '艮/山', lo: '震/雷', bin: '100001' },
    { n: 28, zh: '大過', en: 'Dà Guò', sym: '䷛', up: '兌/澤', lo: '巽/風', bin: '011110' },
    { n: 29, zh: '坎', en: 'Kǎn', sym: '䷜', up: '坎/水', lo: '坎/水', bin: '010010' },
    { n: 30, zh: '離', en: 'Lí', sym: '䷝', up: '離/火', lo: '離/火', bin: '101101' },
    { n: 31, zh: '咸', en: 'Xián', sym: '䷞', up: '兌/澤', lo: '艮/山', bin: '011100' },
    { n: 32, zh: '恆', en: 'Héng', sym: '䷟', up: '震/雷', lo: '巽/風', bin: '001110' },
    { n: 33, zh: '遯', en: 'Dùn', sym: '䷠', up: '乾/天', lo: '艮/山', bin: '111100' },
    { n: 34, zh: '大壯', en: 'Dà Zhuàng', sym: '䷡', up: '震/雷', lo: '乾/天', bin: '001111' },
    { n: 35, zh: '晉', en: 'Jìn', sym: '䷢', up: '離/火', lo: '坤/地', bin: '101000' },
    { n: 36, zh: '明夷', en: 'Míng Yí', sym: '䷣', up: '坤/地', lo: '離/火', bin: '000101' },
    { n: 37, zh: '家人', en: 'Jiā Rén', sym: '䷤', up: '巽/風', lo: '離/火', bin: '110101' },
    { n: 38, zh: '睽', en: 'Kuí', sym: '䷥', up: '離/火', lo: '兌/澤', bin: '101011' },
    { n: 39, zh: '蹇', en: 'Jiǎn', sym: '䷦', up: '坎/水', lo: '艮/山', bin: '010100' },
    { n: 40, zh: '解', en: 'Xiè', sym: '䷧', up: '震/雷', lo: '坎/水', bin: '001010' },
    { n: 41, zh: '損', en: 'Sǔn', sym: '䷨', up: '艮/山', lo: '兌/澤', bin: '100011' },
    { n: 42, zh: '益', en: 'Yì', sym: '䷩', up: '巽/風', lo: '震/雷', bin: '110001' },
    { n: 43, zh: '夬', en: 'Guài', sym: '䷪', up: '兌/澤', lo: '乾/天', bin: '011111' },
    { n: 44, zh: '姤', en: 'Gòu', sym: '䷫', up: '乾/天', lo: '巽/風', bin: '111110' },
    { n: 45, zh: '萃', en: 'Cuì', sym: '䷬', up: '兌/澤', lo: '坤/地', bin: '011000' },
    { n: 46, zh: '升', en: 'Shēng', sym: '䷭', up: '坤/地', lo: '巽/風', bin: '000110' },
    { n: 47, zh: '困', en: 'Kùn', sym: '䷮', up: '兌/澤', lo: '坎/水', bin: '011010' },
    { n: 48, zh: '井', en: 'Jǐng', sym: '䷯', up: '坎/水', lo: '巽/風', bin: '010110' },
    { n: 49, zh: '革', en: 'Gé', sym: '䷰', up: '兌/澤', lo: '離/火', bin: '011101' },
    { n: 50, zh: '鼎', en: 'Dǐng', sym: '䷱', up: '離/火', lo: '巽/風', bin: '101110' },
    { n: 51, zh: '震', en: 'Zhèn', sym: '䷲', up: '震/雷', lo: '震/雷', bin: '001001' },
    { n: 52, zh: '艮', en: 'Gèn', sym: '䷳', up: '艮/山', lo: '艮/山', bin: '100100' },
    { n: 53, zh: '漸', en: 'Jiàn', sym: '䷴', up: '巽/風', lo: '艮/山', bin: '110100' },
    { n: 54, zh: '歸妹', en: 'Guī Mèi', sym: '䷵', up: '震/雷', lo: '兌/澤', bin: '001011' },
    { n: 55, zh: '豐', en: 'Fēng', sym: '䷶', up: '震/雷', lo: '離/火', bin: '001101' },
    { n: 56, zh: '旅', en: 'Lǚ', sym: '䷷', up: '離/火', lo: '艮/山', bin: '101100' },
    { n: 57, zh: '巽', en: 'Xùn', sym: '䷸', up: '巽/風', lo: '巽/風', bin: '110110' },
    { n: 58, zh: '兌', en: 'Duì', sym: '䷹', up: '兌/澤', lo: '兌/澤', bin: '011011' },
    { n: 59, zh: '渙', en: 'Huàn', sym: '䷺', up: '巽/風', lo: '坎/水', bin: '110010' },
    { n: 60, zh: '節', en: 'Jié', sym: '䷻', up: '坎/水', lo: '兌/澤', bin: '010011' },
    { n: 61, zh: '中孚', en: 'Zhōng Fú', sym: '䷼', up: '巽/風', lo: '兌/澤', bin: '110011' },
    { n: 62, zh: '小過', en: 'Xiǎo Guò', sym: '䷽', up: '震/雷', lo: '艮/山', bin: '001100' },
    { n: 63, zh: '既濟', en: 'Jì Jì', sym: '䷾', up: '坎/水', lo: '離/火', bin: '010101' },
    { n: 64, zh: '未濟', en: 'Wèi Jì', sym: '䷿', up: '離/火', lo: '坎/水', bin: '101010' },
];

// Build lookup by Chinese name
const metaByName = {};
HEXAGRAM_META.forEach(m => { metaByName[m.zh] = m; });

// Parse CSV - handle multiline fields in quotes
function parseCSV(text) {
    const rows = [];
    let current = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"' && text[i + 1] === '"') {
                field += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ',') {
                current.push(field);
                field = '';
            } else if (ch === '\r') {
                // skip
            } else if (ch === '\n' && !inQuotes) {
                current.push(field);
                field = '';
                if (current.length > 1) rows.push(current);
                current = [];
            } else {
                field += ch;
            }
        }
    }
    if (field || current.length) {
        current.push(field);
        if (current.length > 1) rows.push(current);
    }
    return rows;
}

const rows = parseCSV(csv);
// Skip header
const dataRows = rows.slice(1);

// Identify hexagram names from CSV id column
// Each hexagram has: 卦名 row, then 卦名初, 卦名二, ..., 卦名上, optionally 卦名用
const YAO_SUFFIXES = ['初', '二', '三', '四', '五', '上'];
const hexagrams = {};
let currentGuaName = null;

// 清理解讀文字：只有句號「。」後才換行，其他換行符號合併
function cleanText(text) {
    if (!text) return '';
    // 1. Replace newlines after 。 with a placeholder
    let result = text.replace(/。\s*\n/g, '。\x00');
    // 2. Remove all remaining newlines (join lines)
    result = result.replace(/\n/g, '');
    // 3. Restore placeholders to newlines
    result = result.replace(/\x00/g, '\n');
    // 4. Clean up extra whitespace
    result = result.replace(/\n{3,}/g, '\n\n').trim();
    return result;
}

for (const row of dataRows) {
    const id = (row[0] || '').trim();
    const guaBie = (row[1] || '').trim();
    const guaTu = (row[2] || '').trim();
    const guaYaoCi = (row[3] || '').trim();
    const xiangCi = (row[4] || '').trim();
    const tuanCi = (row[5] || '').trim();
    const jieDu = (row[6] || '').trim();

    // Determine if this is a hexagram header or a yao line
    // Header: id matches a known gua name exactly (e.g. "乾", "坤", "屯卦", "小畜")
    // Yao: id ends with 初/二/三/四/五/上/用

    let isYao = false;
    let yaoPos = -1;
    let guaNameFromYao = null;

    for (let i = 0; i < YAO_SUFFIXES.length; i++) {
        if (id.endsWith(YAO_SUFFIXES[i])) {
            isYao = true;
            yaoPos = i + 1;
            guaNameFromYao = id.slice(0, -YAO_SUFFIXES[i].length);
            break;
        }
    }

    if (id.endsWith('用')) {
        // 用九 or 用六 line, skip
        continue;
    }

    if (isYao && guaNameFromYao) {
        // This is a yao line
        if (!hexagrams[guaNameFromYao]) continue;
        const h = hexagrams[guaNameFromYao];
        // Extract yao ci
        let yaoCi = guaYaoCi.replace(/^[，,\s]+/, '').trim();
        let xiangText = xiangCi.replace(/^象曰[：:]\s*/, '').trim();
        // Determine yang/yin from yao ci text
        const isYang = /^(初九|九二|九三|九四|九五|上九)/.test(yaoCi);
        // Extract yao-level interpretation (傅佩榮解讀)
        let yaoJieDu = '';
        if (jieDu) {
            yaoJieDu = cleanText(jieDu);
        }
        h.yao.push({
            p: yaoPos,
            t: isYang ? 'yang' : 'yin',
            yc: yaoCi,
            xt: xiangText,
            jd: yaoJieDu
        });
    } else {
        // This is a hexagram header line
        // Find matching hexagram name
        let guaName = id.replace(/卦$/, '').trim();
        // Also try guaBie column
        if (!metaByName[guaName] && guaBie) {
            guaName = guaBie.replace(/卦$/, '').trim();
        }

        const meta = metaByName[guaName];
        if (!meta) {
            console.warn(`Unknown hexagram: "${guaName}" (id="${id}", guaBie="${guaBie}")`);
            continue;
        }

        currentGuaName = guaName;

        // Extract gua ci - remove leading gua name
        let gc = guaYaoCi.trim();
        // Remove gua name prefix like "乾：" or "坤：" etc
        gc = gc.replace(new RegExp(`^${guaName}[：:，,]\\s*`), '').trim();

        // Extract xiang zhuan - remove 象曰：
        let xz = xiangCi.replace(/^象曰[：:]\s*/, '').trim();

        // Extract tuan zhuan - remove 彖曰：
        let tz = tuanCi.replace(/^彖曰[：:]\s*/, '').trim();

        // Extract interpretation / description — clean text, only break at 。
        let desc = '';
        if (jieDu) {
            desc = cleanText(jieDu);
        }

        hexagrams[guaName] = {
            ...meta,
            gc,
            tz,
            xz,
            desc,
            yao: []
        };
    }
}

// Generate the JS output
const allHex = Object.values(hexagrams).sort((a, b) => a.n - b.n);

let output = `// 六十四卦完整資料 — 自 IChingData.csv 匯入
// 包含卦辭、象傳、彖傳、爻辭、傅佩榮白話解讀

const HEXAGRAMS = [\n`;

for (const h of allHex) {
    // Sort yao by position
    h.yao.sort((a, b) => a.p - b.p);

    const yaoStr = h.yao.map(y => {
        const ycEscaped = y.yc.replace(/'/g, "\\'").replace(/\n/g, '');
        const xtEscaped = y.xt.replace(/'/g, "\\'").replace(/\n/g, '');
        const jdEscaped = (y.jd || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
        return `{p:${y.p},t:'${y.t}',yc:'${ycEscaped}',xt:'${xtEscaped}',jd:'${jdEscaped}'}`;
    }).join(',');

    const gcEscaped = h.gc.replace(/'/g, "\\'").replace(/\n/g, '');
    const tzEscaped = h.tz.replace(/'/g, "\\'").replace(/\n/g, '');
    const xzEscaped = h.xz.replace(/'/g, "\\'").replace(/\n/g, '');
    const descEscaped = h.desc.replace(/'/g, "\\'").replace(/\n/g, '\\n');

    output += `{n:${h.n},zh:'${h.zh}',en:'${h.en}',sym:'${h.sym}',up:'${h.up}',lo:'${h.lo}',bin:'${h.bin}',gc:'${gcEscaped}',tz:'${tzEscaped}',xz:'${xzEscaped}',desc:'${descEscaped}',yao:[${yaoStr}]},\n`;
}

output += `];\n\n`;

// Add utility functions
output += `// 依卦序取卦
export function getHexagramByNumber(number) {
  return HEXAGRAMS.find(h => h.n === number) || null;
}

// 依二進位取卦
export function getHexagramByBinary(binary) {
  return HEXAGRAMS.find(h => h.bin === binary) || null;
}

// 取得所有卦象
export function getAllHexagrams() {
  return HEXAGRAMS;
}

// 格式化卦象為標準物件
export function formatHexagram(h) {
  if (!h) return null;
  return {
    id: h.n,
    number: h.n,
    name_zh: h.zh,
    name_en: h.en,
    symbol: h.sym,
    upper_trigram: h.up,
    lower_trigram: h.lo,
    binary_repr: h.bin,
    gua_ci: h.gc,
    tuan_zhuan: h.tz || '',
    xiang_zhuan: h.xz || '',
    description: h.desc || '',
    yao_texts: (h.yao || []).map(y => ({
      position: y.p,
      yao_type: y.t,
      yao_ci: y.yc,
      xiang_text: y.xt || '',
      jie_du: y.jd || ''
    }))
  };
}
`;

const outPath = path.join(__dirname, '../src/data/hexagrams.js');
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`✅ Generated hexagrams.js with ${allHex.length} hexagrams`);
allHex.forEach(h => {
    console.log(`  ${h.n}. ${h.zh} (${h.en}) - ${h.yao.length} yao`);
});
