import styles from './YaoLine.module.css';
import { isYang, isChanging } from '@/lib/divination';

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上'];

export default function YaoLine({ value, position, animated = false, showLabel = false }) {
    const yang = isYang(value);
    const changing = isChanging(value);
    const typeClass = yang ? styles.yang : styles.yin;
    const changingClass = changing ? styles.changing : '';
    const animClass = animated ? styles.animated : '';

    return (
        <div className={`${styles.yaoLine} ${typeClass} ${changingClass} ${animClass}`}>
            {yang ? (
                <div className={styles.yaoSegment} />
            ) : (
                <>
                    <div className={styles.yaoSegment} />
                    <div className={styles.yaoSegment} />
                </>
            )}
            {showLabel && (
                <span className={styles.yaoLabel}>
                    {POSITION_NAMES[position - 1]}{changing ? '⟡' : ''}
                </span>
            )}
        </div>
    );
}
