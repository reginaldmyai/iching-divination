import { supabase } from './supabase';

/**
 * 儲存卜卦記錄到 Supabase
 */
export async function saveRecord({ hexagramNumber, hexagramName, hexagramSymbol, changedHexagramNumber, question, yaoValues }) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('divination_records')
        .insert({
            user_id: user?.id || null,
            question: question || '',
            hexagram_number: hexagramNumber,
            hexagram_name: hexagramName,
            hexagram_symbol: hexagramSymbol,
            changed_hexagram_number: changedHexagramNumber || null,
            yao_values: yaoValues,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * 取得卜卦記錄列表
 */
export async function getRecords() {
    const { data, error } = await supabase
        .from('divination_records')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * 刪除單筆卜卦記錄
 */
export async function deleteRecord(id) {
    const { error } = await supabase
        .from('divination_records')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
