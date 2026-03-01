'use client';
import { useState } from 'react';
import { useDivinationStore } from '@/stores/useDivinationStore';
import { useRouter } from 'next/navigation';
import { saveRecord } from '@/lib/records';
import YaoLine from '@/components/YaoLine';
import Link from 'next/link';
import styles from './page.module.css';

export default function ResultPage() {
    const { hexagram, changedHexagram, changingLines, yaoValues, question, reset } = useDivinationStore();
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    if (!hexagram) {
        return (
            <div className={styles.empty}>
                <p>尚未卜卦</p>
                <Link href="/divination" className="btn btn-primary">前往卜卦</Link>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveRecord({
                hexagramNumber: hexagram.number,
                hexagramName: hexagram.name_zh,
                hexagramSymbol: hexagram.symbol,
                changedHexagramNumber: changedHexagram?.number || null,
                question: question || '',
                yaoValues,
            });
            setSaved(true);
        } catch (err) {
            // Supabase 失敗時 fallback 到 localStorage
            console.warn('Supabase save failed, using localStorage:', err.message);
            try {
                const records = JSON.parse(localStorage.getItem('iching-records') || '[]');
                records.unshift({
                    id: Date.now().toString(),
                    hexagram_number: hexagram.number,
                    hexagram_name: hexagram.name_zh,
                    hexagram_symbol: hexagram.symbol,
                    changed_hexagram_number: changedHexagram?.number || null,
                    question: question || '',
                    yao_values: yaoValues,
                    created_at: new Date().toISOString(),
                });
                localStorage.setItem('iching-records', JSON.stringify(records));
                setSaved(true);
            } catch { }
        }
        setSaving(false);
    };

    const handleNewDivination = () => {
        reset();
        router.push('/divination');
    };

    return (
        <div className={styles.container}>
            {question && <p className={styles.question}>「{question}」</p>}

            {/* Main hexagram */}
            <section className={`${styles.hexSection} fade-in`}>
                <h2 className={styles.label}>本卦</h2>
                <div className={styles.hexCard}>
                    <span className={styles.symbol}>{hexagram.symbol}</span>
                    <h1 className={styles.hexName}>{hexagram.number}. {hexagram.name_zh}</h1>
                    <p className={styles.hexEn}>{hexagram.name_en}</p>
                    <p className={styles.trigrams}>{hexagram.upper_trigram} ▲ {hexagram.lower_trigram} ▼</p>
                </div>
            </section>

            {/* Yao lines */}
            <section className={`${styles.yaoSection} fade-in-delay-1`}>
                <h2 className="section-title">卦象</h2>
                <div className={styles.yaoBox}>
                    {[...yaoValues].reverse().map((v, i) => (
                        <div key={i} className={styles.yaoRow}>
                            <YaoLine value={v} position={6 - i} showLabel />
                        </div>
                    ))}
                </div>
                {changingLines.length > 0 && (
                    <p className={styles.changingNote}>
                        變爻：第 {changingLines.join('、')} 爻
                    </p>
                )}
            </section>

            {/* Gua Ci */}
            <section className={`${styles.textSection} fade-in-delay-2`}>
                <h2 className="section-title">卦辭</h2>
                <p className={styles.guaCi}>{hexagram.gua_ci}</p>
                {hexagram.xiang_zhuan && (
                    <>
                        <h3 className={styles.subTitle}>象傳</h3>
                        <p className={styles.text}>{hexagram.xiang_zhuan}</p>
                    </>
                )}
                {hexagram.description && (
                    <>
                        <h3 className={styles.subTitle}>傅佩榮解讀</h3>
                        <div className={styles.text}>
                            {hexagram.description.split('\n').map((line, i) => (
                                <p key={i} style={{ marginBottom: line.trim() === '' ? '0.5em' : '0.3em' }}>{line}</p>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Yao texts */}
            {hexagram.yao_texts && hexagram.yao_texts.length > 0 && (
                <section className={`${styles.textSection} fade-in-delay-3`}>
                    <h2 className="section-title">爻辭</h2>
                    {hexagram.yao_texts.map(y => (
                        <div key={y.position} className={`${styles.yaoTextItem} ${changingLines.includes(y.position) ? styles.changingYao : ''}`}>
                            <p className={styles.yaoCi}>{y.yao_ci}</p>
                            {y.xiang_text && <p className={styles.xiangText}>{y.xiang_text}</p>}
                        </div>
                    ))}
                </section>
            )}

            {/* Changed hexagram */}
            {changedHexagram && (
                <section className={`${styles.hexSection} ${styles.changedSection} fade-in-delay-3`}>
                    <h2 className={styles.label}>變卦</h2>
                    <Link href={`/hexagrams/${changedHexagram.number}`} className={styles.hexCard}>
                        <span className={styles.symbol}>{changedHexagram.symbol}</span>
                        <h3 className={styles.hexName}>{changedHexagram.number}. {changedHexagram.name_zh}</h3>
                        <p className={styles.hexEn}>{changedHexagram.name_en}</p>
                        <p className={styles.text}>{changedHexagram.gua_ci}</p>
                    </Link>
                </section>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                <button className="btn btn-primary" onClick={handleNewDivination}>🪙 再次卜卦</button>
                <button className="btn btn-secondary" onClick={handleSave} disabled={saved || saving}>
                    {saving ? '⏳ 保存中...' : saved ? '✓ 已保存' : '💾 保存記錄'}
                </button>
                <Link href={`/hexagrams/${hexagram.number}`} className="btn btn-secondary">📖 詳細解讀</Link>
            </div>
        </div>
    );
}
