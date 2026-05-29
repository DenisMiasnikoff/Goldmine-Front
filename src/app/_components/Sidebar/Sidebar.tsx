'use client'
import { Birdhouse, Telescope, Warehouse } from 'lucide-react';
import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isVisible: boolean;
}

export default function Sidebar({ isVisible }: SidebarProps) {
  const sidebarClasses = `${styles.sidebar} ${!isVisible ? styles.sidebarHidden : ''}`;
  const pathName=usePathname();
  return (
    <nav className={sidebarClasses}>
      <ul className={styles.sideNav}>
        <li className={`${styles.sideNav__item} ${pathName==='/'?styles.sideNav__item_active:""}`}>
          <Link href="/" className={styles.sideNav__link}>
            <Birdhouse color="#663300" />
            <span> Home</span>
          </Link>
        </li>
        <li className={`${styles.sideNav__item} ${pathName==='/popular'?styles.sideNav__item_active:""}`}>
          <Link href="/popular" className={styles.sideNav__link}>
            <Telescope color="#663300" />
            <span> Popular</span>
          </Link>
        </li>
        <li className={`${styles.sideNav__item} ${pathName==='/dungeons'?styles.sideNav__item_active:""}`}>
          <Link href="/dungeons" className={styles.sideNav__link}>
            <Warehouse color="#663300" />
            <span> Dungeons</span>
          </Link>
          
        </li>
         <li className={`${styles.sideNav__item} ${pathName==='/my-dungeons'?styles.sideNav__item_active:""}`}>
          <Link href="/my-dungeons" className={styles.sideNav__link}>
            <Warehouse color="#663300" />
            <span>My Dungeons</span>
          </Link>
          
        </li>

      </ul>

      <div className={styles.legal}>
        &copy; 2026 goldenden347. All rights reserved.
      </div>
    </nav>
  );
}