'use client';
import { useState, useEffect } from 'react';
import { getRecords, deleteRecord } from '@/lib/records';
import Link from 'next/link';
import styles from './page.module.css';

export default function HistoryPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState(''); // 'supabase' or 'local'

    useEffect(() => {
        loadRecords();
    }, []);

    async function loadRecords() {
        setLoading(true);
        try {
            // 先從 Supabase 讀取
            const data = await getRecords();
            if (data.length > 0) {
                setRecords(data);
                setSource('supabase');
                setLoading(false);
                return;
            }
        } catch (err) {
            console.warn('Supabase fetch failed:', err.message);
        }

        // Fallback: 從 localStorage 讀取
        try {
            const saved = localStorage.getItem('iching-records');
            if (saved) {
                setRecords(JSON.parse(saved));
                setSource('local');
            }
        } catch { }
        setLoading(false);
    }

    async function handleDelete(id) {
        if (source === 'supabase') {
            try {
                await deleteRecord(id);
                setRecords(records.filter(r => r.id !== id));
            } catch (err) {
                console.warn('Supabase delete failed:', err.message);
            }
        } else {
            const updated = records.filter(r => r.id !== id);
            setRecords(updated);
            localStorage.setItem('iching-records', JSON.stringify(updated));
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>卜卦歷史</h1>
                <p className={styles.emptyText}>載入中...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>卜卦歷史</h1>

            {records.length === 0 ? (
                <div className={styles.empty}>
                    <p className={styles.emptyText}>尚無卜卦記錄</p>
                    <Link href="/divination" className="btn btn-primary">前往卜卦</Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {records.map(r => (
                        <div key={r.id} className={styles.card}>
                            <Link href={`/hexagrams/${r.hexagram_number}`} className={styles.cardLink}>
                                <span className={styles.cardSymbol}>{r.hexagram_symbol}</span>
                                <div className={styles.cardInfo}>
                                    <div className={styles.cardName}>{r.hexagram_number}. {r.hexagram_name}</div>
                                    {r.question && <div className={styles.cardQuestion}>「{r.question}」</div>}
                                    <div className={styles.cardDate}>{new Date(r.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </Link>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(r.id)}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
