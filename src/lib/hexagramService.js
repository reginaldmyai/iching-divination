import { supabase } from './supabase';

/**
 * 從 Supabase 取得單一卦象（by 卦序號碼）
 */
export async function getHexagramByNumber(number) {
    const { data, error } = await supabase
        .from('hexagrams')
        .select('*')
        .eq('number', number)
        .single();

    if (error) {
        console.error('getHexagramByNumber error:', error.message);
        return null;
    }
    return formatHexagram(data);
}

/**
 * 從 Supabase 取得單一卦象（by 二進位字串）
 */
export async function getHexagramByBinary(binary) {
    const { data, error } = await supabase
        .from('hexagrams')
        .select('*')
        .eq('binary_repr', binary)
        .single();

    if (error) {
        console.error('getHexagramByBinary error:', error.message);
        return null;
    }
    return formatHexagram(data);
}

/**
 * 從 Supabase 取得全部六十四卦
 */
export async function getAllHexagrams() {
    const { data, error } = await supabase
        .from('hexagrams')
        .select('*')
        .order('number', { ascending: true });

    if (error) {
        console.error('getAllHexagrams error:', error.message);
        return [];
    }
    return data.map(formatHexagram);
}

/**
 * 格式化 Supabase 回傳的卦象資料為前端使用格式
 */
function formatHexagram(row) {
    if (!row) return null;
    const yao = typeof row.yao === 'string' ? JSON.parse(row.yao) : (row.yao || []);
    return {
        id: row.number,
        number: row.number,
        name_zh: row.name_zh,
        name_en: row.name_en,
        symbol: row.symbol,
        upper_trigram: row.upper_trigram,
        lower_trigram: row.lower_trigram,
        binary_repr: row.binary_repr,
        gua_ci: row.gua_ci || '',
        tuan_zhuan: row.tuan_zhuan || '',
        xiang_zhuan: row.xiang_zhuan || '',
        description: row.description || '',
        yao_texts: yao.map(y => ({
            position: y.p,
            yao_type: y.t,
            yao_ci: y.yc,
            xiang_text: y.xt || '',
            jie_du: y.jd || ''
        }))
    };
}
