'use client';
import { use, useEffect, useState } from 'react';
import { getHexagramByNumber } from '@/lib/hexagramService';
import { getUpperTrigram, getLowerTrigram, getTrigramInfo } from '@/lib/divination';
import Link from 'next/link';
import styles from './page.module.css';

export default function HexagramDetailPage({ params }) {
    const { number } = use(params);
    const num = parseInt(number);
    const [hex, setHex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getHexagramByNumber(num);
            setHex(data);
            setLoading(false);
        }
        load();
    }, [num]);

    if (loading) {
        return <div className={styles.empty}><p>載入中...</p></div>;
    }

    if (!hex) {
        return (
            <div className={styles.empty}>
                <p>找不到此卦象</p>
                <Link href="/hexagrams" className="btn btn-secondary">返回六十四卦</Link>
            </div>
        );
    }

    const binary = hex.binary_repr;
    const upperInfo = getTrigramInfo(getUpperTrigram(binary));
    const lowerInfo = getTrigramInfo(getLowerTrigram(binary));

    return (
        <div className={styles.container}>
            {/* Header */}
            <section className={`${styles.header} fade-in`}>
                <span className={styles.symbol}>{hex.symbol}</span>
                <h1 className={styles.name}>第{hex.number}卦 · {hex.name_zh}</h1>
                <p className={styles.nameEn}>{hex.name_en}</p>
            </section>

            {/* Trigrams */}
            <section className={`${styles.section} fade-in-delay-1`}>
                <div className={styles.trigramRow}>
                    <div className={styles.trigramBox}>
                        <span className={styles.trigramLabel}>上卦</span>
                        <span className={styles.trigramName}>{upperInfo?.name} / {upperInfo?.nature}</span>
                        <span className={styles.trigramAttr}>{upperInfo?.attribute}</span>
                    </div>
                    <div className={styles.trigramBox}>
                        <span className={styles.trigramLabel}>下卦</span>
                        <span className={styles.trigramName}>{lowerInfo?.name} / {lowerInfo?.nature}</span>
                        <span className={styles.trigramAttr}>{lowerInfo?.attribute}</span>
                    </div>
                </div>
            </section>

            {/* Gua Ci */}
            <section className={`${styles.section} fade-in-delay-1`}>
                <h2 className="section-title">卦辭</h2>
                <p className={styles.guaCi}>{hex.gua_ci}</p>
            </section>

            {/* Tuan Zhuan */}
            {hex.tuan_zhuan && (
                <section className={`${styles.section} fade-in-delay-2`}>
                    <h2 className="section-title">彖傳</h2>
                    <p className={styles.text}>{hex.tuan_zhuan}</p>
                </section>
            )}

            {/* Xiang Zhuan */}
            {hex.xiang_zhuan && (
                <section className={`${styles.section} fade-in-delay-2`}>
                    <h2 className="section-title">象傳</h2>
                    <p className={styles.text}>{hex.xiang_zhuan}</p>
                </section>
            )}

            {/* Description / 傅佩榮解讀 */}
            {hex.description && (
                <section className={`${styles.section} fade-in-delay-2`}>
                    <h2 className="section-title">傅佩榮解讀</h2>
                    <div className={styles.text}>
                        {hex.description.split('\n').map((line, i) => (
                            <p key={i} style={{ marginBottom: line.trim() === '' ? '0.5em' : '0.3em' }}>{line}</p>
                        ))}
                    </div>
                </section>
            )}

            {/* Yao Texts */}
            {hex.yao_texts && hex.yao_texts.length > 0 && (
                <section className={`${styles.section} fade-in-delay-3`}>
                    <h2 className="section-title">爻辭</h2>
                    {hex.yao_texts.map(y => (
                        <div key={y.position} className={styles.yaoItem}>
                            <p className={styles.yaoCi}>{y.yao_ci}</p>
                            {y.xiang_text && <p className={styles.xiangText}>{y.xiang_text}</p>}
                            {y.jie_du && (
                                <div className={styles.jieDu}>
                                    {y.jie_du.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Navigation */}
            <div className={styles.nav}>
                {num > 1 && <Link href={`/hexagrams/${num - 1}`} className="btn btn-secondary">← 第{num - 1}卦</Link>}
                <Link href="/hexagrams" className="btn btn-secondary">六十四卦</Link>
                {num < 64 && <Link href={`/hexagrams/${num + 1}`} className="btn btn-secondary">第{num + 1}卦 →</Link>}
            </div>
        </div>
    );
}
