import Link from 'next/link';
import styles from './HexagramCard.module.css';

export default function HexagramCard({ hexagram, variant = 'default', onClick }) {
    const variantClass = variant === 'mini' ? styles.cardMini
        : variant === 'large' ? styles.cardLarge : '';

    const content = (
        <>
            <span className={styles.symbol}>{hexagram.symbol}</span>
            <div className={styles.info}>
                <div className={styles.name}>{hexagram.number}. {hexagram.name_zh}</div>
                <div className={styles.nameEn}>{hexagram.name_en}</div>
                {variant !== 'mini' && (
                    <div className={styles.trigrams}>
                        {hexagram.upper_trigram} ▲ {hexagram.lower_trigram} ▼
                    </div>
                )}
                <div className={styles.guaCi}>{hexagram.gua_ci}</div>
            </div>
        </>
    );

    if (onClick) {
        return (
            <div className={`${styles.card} ${variantClass}`} onClick={onClick}>
                {content}
            </div>
        );
    }

    return (
        <Link href={`/hexagrams/${hexagram.number}`} className={`${styles.card} ${variantClass}`}>
            {content}
        </Link>
    );
}
