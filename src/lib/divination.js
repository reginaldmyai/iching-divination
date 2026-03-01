import { YAO, BINARY_TO_NUMBER, NUMBER_TO_BINARY, TRIGRAMS } from './constants';

/**
 * 模擬擲三枚銅錢
 * 正面 = 3, 反面 = 2
 * 三枚加總: 6(老陰), 7(少陽), 8(少陰), 9(老陽)
 */
export function tossCoin() {
    const coins = Array.from({ length: 3 }, () => (Math.random() < 0.5 ? 2 : 3));
    return coins.reduce((sum, c) => sum + c, 0);
}

/**
 * 起卦 — 生成六爻
 * @returns {number[]} 六爻值陣列 [初爻, 二爻, ..., 上爻]
 */
export function castHexagram() {
    return Array.from({ length: 6 }, () => tossCoin());
}

/**
 * 判斷爻值是否為陽爻
 */
export function isYang(value) {
    return value === YAO.YOUNG_YANG || value === YAO.OLD_YANG;
}

/**
 * 判斷爻值是否為變爻
 */
export function isChanging(value) {
    return value === YAO.OLD_YIN || value === YAO.OLD_YANG;
}

/**
 * 將六爻值轉為二進位字串
 * yaoValues[0]=初爻(底), 但 binary[0]=上爻(頂) 以匹配卦序映射表
 * @param {number[]} yaoValues - 六爻值 [初爻, ..., 上爻]
 * @returns {string} 六位二進位字串 (上爻在前)
 */
export function yaoToBinary(yaoValues) {
    return [...yaoValues].reverse().map(v => isYang(v) ? '1' : '0').join('');
}

/**
 * 計算變卦的二進位
 * 老陽(9) → 陰(0), 老陰(6) → 陽(1)
 */
export function getChangedBinary(yaoValues) {
    return [...yaoValues].reverse().map(v => {
        if (v === YAO.OLD_YANG) return '0';
        if (v === YAO.OLD_YIN) return '1';
        return isYang(v) ? '1' : '0';
    }).join('');
}

/**
 * 取得變爻位置（1-indexed）
 */
export function getChangingLines(yaoValues) {
    return yaoValues
        .map((v, i) => isChanging(v) ? i + 1 : null)
        .filter(Boolean);
}

/**
 * 從二進位字串查找卦序
 */
export function binaryToHexagramNumber(binary) {
    return BINARY_TO_NUMBER[binary] || null;
}

/**
 * 從卦序取得二進位字串
 */
export function hexagramNumberToBinary(number) {
    return NUMBER_TO_BINARY[number] || null;
}

/**
 * 完整卜卦流程
 * @param {number[]} yaoValues - 六爻值
 * @returns {{ hexagramNumber, changedHexagramNumber, changingLines, binary, changedBinary }}
 */
export function interpretCast(yaoValues) {
    const binary = yaoToBinary(yaoValues);
    const hexagramNumber = binaryToHexagramNumber(binary);
    const changingLines = getChangingLines(yaoValues);

    let changedHexagramNumber = null;
    let changedBinary = null;

    if (changingLines.length > 0) {
        changedBinary = getChangedBinary(yaoValues);
        changedHexagramNumber = binaryToHexagramNumber(changedBinary);
    }

    return {
        hexagramNumber,
        changedHexagramNumber,
        changingLines,
        binary,
        changedBinary,
    };
}

/**
 * 取得上卦三爻 (binary 前三位 = 上爻、五爻、四爻)
 */
export function getUpperTrigram(binary) {
    return binary.slice(0, 3);
}

/**
 * 取得下卦三爻 (binary 後三位 = 三爻、二爻、初爻)
 */
export function getLowerTrigram(binary) {
    return binary.slice(3, 6);
}

/**
 * 取得卦的八卦資訊
 */
export function getTrigramInfo(trigramBinary) {
    return TRIGRAMS[trigramBinary] || null;
}

/**
 * 基於日期的每日一卦（確定性隨機）
 */
export function getDailyHexagramNumber(dateStr) {
    let hash = 0;
    const s = dateStr + 'iching';
    for (let i = 0; i < s.length; i++) {
        const ch = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash |= 0;
    }
    return (Math.abs(hash) % 64) + 1;
}
