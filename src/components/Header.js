import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>☰</span>
                <span>易經卜卦</span>
            </div>
        </header>
    );
}
