'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDailyHexagramNumber } from '@/lib/divination';
import { getHexagramByNumber, formatHexagram } from '@/data/hexagrams';
import HexagramCard from '@/components/HexagramCard';
import styles from './page.module.css';

export default function HomePage() {
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const num = getDailyHexagramNumber(today);
    const hex = formatHexagram(getHexagramByNumber(num));
    setDaily(hex);
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={`${styles.hero} fade-in`}>
        <div className={styles.heroSymbol}>☰</div>
        <h1 className={styles.heroTitle}>易經卜卦</h1>
        <p className={styles.heroSub}>窺探天機，洞悉命理</p>
      </section>

      {/* Quick Action */}
      <section className="fade-in-delay-1">
        <Link href="/divination" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
          🪙 立即卜卦
        </Link>
      </section>

      {/* Daily Hexagram */}
      {daily && (
        <section className="fade-in-delay-2">
          <h2 className="section-title">📅 今日一卦</h2>
          <HexagramCard hexagram={daily} />
          <p className={styles.dailyDesc}>{daily.description}</p>
        </section>
      )}

      {/* Feature Cards */}
      <section className="fade-in-delay-3">
        <h2 className="section-title">✨ 功能</h2>
        <div className={styles.features}>
          <Link href="/divination" className={styles.featureCard}>
            <span className={styles.featureIcon}>🪙</span>
            <span className={styles.featureLabel}>擲銅錢卜卦</span>
            <span className={styles.featureDesc}>模擬傳統三枚銅錢起卦法</span>
          </Link>
          <Link href="/hexagrams" className={styles.featureCard}>
            <span className={styles.featureIcon}>📖</span>
            <span className={styles.featureLabel}>六十四卦辭典</span>
            <span className={styles.featureDesc}>完整卦辭、爻辭、彖象傳</span>
          </Link>
        </div>
      </section>

      {/* Xiang Zhuan quote */}
      <section className={`${styles.quote} fade-in-delay-3`}>
        <blockquote>
          「天行健，君子以自強不息。<br />地勢坤，君子以厚德載物。」
        </blockquote>
      </section>
    </div>
  );
}
