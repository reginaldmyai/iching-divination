'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import styles from './BottomNav.module.css';

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            {NAV_ITEMS.map(item => {
                const isActive = pathname === item.path ||
                    (item.path !== '/' && pathname.startsWith(item.path));
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
