'use client';
import { useState, useMemo } from 'react';
import { getAllHexagrams, formatHexagram } from '@/data/hexagrams';
import HexagramCard from '@/components/HexagramCard';
import styles from './page.module.css';

export default function HexagramsPage() {
    const [search, setSearch] = useState('');
    const allHex = useMemo(() => getAllHexagrams().map(formatHexagram), []);

    const filtered = useMemo(() => {
        if (!search.trim()) return allHex;
        const q = search.trim().toLowerCase();
        return allHex.filter(h =>
            h.name_zh.includes(q) || h.name_en.toLowerCase().includes(q) ||
            h.gua_ci.includes(q) || String(h.number) === q
        );
    }, [search, allHex]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>六十四卦</h1>
            <input
                className={`input ${styles.searchInput}`}
                type="text"
                placeholder="搜尋卦名、卦序..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className={styles.grid}>
                {filtered.map(h => (
                    <HexagramCard key={h.number} hexagram={h} variant="mini" />
                ))}
            </div>
            {filtered.length === 0 && (
                <p className={styles.empty}>找不到符合的卦象</p>
            )}
        </div>
    );
}
