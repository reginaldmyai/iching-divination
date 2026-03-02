'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDivinationStore } from '@/stores/useDivinationStore';
import { tossCoin, interpretCast } from '@/lib/divination';
import { getHexagramByNumber } from '@/lib/hexagramService';
import YaoLine from '@/components/YaoLine';
import styles from './page.module.css';

export default function DivinationPage() {
    const router = useRouter();
    const store = useDivinationStore();
    const [coinAnim, setCoinAnim] = useState(false);

    // 頁面載入時，若上次卜卦未完成或已完成，自動重置
    useEffect(() => {
        if (store.phase !== 'input') {
            store.reset();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleToss = useCallback(async () => {
        if (store.currentYao >= 6) return;
        setCoinAnim(true);

        // Animate for 1s then reveal
        await new Promise(r => setTimeout(r, 1000));
        const value = tossCoin();
        store.addYao(value);
        setCoinAnim(false);

        // If all 6 done, compute result
        const newValues = [...store.yaoValues, value];
        if (newValues.length === 6) {
            const result = interpretCast(newValues);
            // 從 Supabase 非同步取得卦象資料
            const hex = await getHexagramByNumber(result.hexagramNumber);
            const changed = result.changedHexagramNumber
                ? await getHexagramByNumber(result.changedHexagramNumber)
                : null;
            setTimeout(() => {
                store.setResult({
                    hexagram: hex,
                    changedHexagram: changed,
                    changingLines: result.changingLines,
                });
                router.push('/divination/result');
            }, 500);
        }
    }, [store, router]);

    const handleStart = () => {
        store.startDivination();
    };

    // Phase: input
    if (store.phase === 'input') {
        return (
            <div className={styles.container}>
                <div className={`${styles.inputSection} fade-in`}>
                    <h1 className={styles.title}>卜卦問事</h1>
                    <p className={styles.subtitle}>心誠則靈，靜心默想您的問題</p>

                    <div className={styles.questionBox}>
                        <textarea
                            className="textarea"
                            placeholder="請輸入您想問的問題（選填）..."
                            value={store.question}
                            onChange={e => store.setQuestion(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <button className={`btn btn-primary btn-lg ${styles.startBtn}`} onClick={handleStart}>
                        🪙 開始起卦
                    </button>

                    <div className={styles.instructions}>
                        <h3>起卦方式</h3>
                        <p>模擬傳統擲三枚銅錢法，每次擲出一爻，共需六次。</p>
                        <ul>
                            <li><strong>6（老陰）</strong>— 變爻，陰變陽</li>
                            <li><strong>7（少陽）</strong>— 陽爻</li>
                            <li><strong>8（少陰）</strong>— 陰爻</li>
                            <li><strong>9（老陽）</strong>— 變爻，陽變陰</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Phase: casting
    const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

    return (
        <div className={styles.container}>
            <div className={`${styles.castingSection} fade-in`}>
                <h1 className={styles.title}>起卦中</h1>
                <p className={styles.subtitle}>
                    {store.currentYao < 6
                        ? `第 ${store.currentYao + 1} 爻 — ${yaoNames[store.currentYao]}`
                        : '卦象已成'}
                </p>

                {/* Yao lines display - 上爻在上、初爻在下，從下往上逐步填入 */}
                <div className={styles.yaoDisplay}>
                    {[5, 4, 3, 2, 1, 0].map(yaoIndex => {
                        const hasCast = yaoIndex < store.yaoValues.length;
                        return (
                            <div key={yaoIndex} className={styles.yaoRow} style={{ opacity: hasCast ? 1 : 0.15 }}>
                                <span className={styles.yaoNumber}>{yaoNames[yaoIndex]}</span>
                                {hasCast ? (
                                    <div className={styles.yaoLineWrap}>
                                        <YaoLine value={store.yaoValues[yaoIndex]} position={yaoIndex + 1} animated />
                                    </div>
                                ) : (
                                    <div className={styles.yaoPlaceholder} />
                                )}
                                {hasCast && (
                                    <span className={styles.yaoValue}>{store.yaoValues[yaoIndex]}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Coin animation */}
                {store.currentYao < 6 && (
                    <button
                        className={`${styles.coinBtn} ${coinAnim ? styles.coinFlipping : ''}`}
                        onClick={handleToss}
                        disabled={coinAnim}
                    >
                        <img src="/coin.png" alt="銅錢" className={styles.coinImg} />
                    </button>
                )}

                {store.currentYao < 6 && (
                    <p className={styles.hint}>點擊銅錢擲出第 {store.currentYao + 1} 爻</p>
                )}
            </div>
        </div>
    );
}
