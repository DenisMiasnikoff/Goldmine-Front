import { Bell } from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  onLogoClick: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={onLogoClick} style={{cursor:'pointer'}}>
        <span>Goldmine</span>
      </div>

      <form action="#" className={styles.search}>
        <input type="text" className={styles.searchInput} placeholder="Search for communities" />
        <button className={styles.searchButton}>
          <span className={styles.searchIcon}>🔍</span>
        </button>
      </form>

      <nav className={styles.userNav}>
        <div className={styles.userNavIconBox}>
          
          <Bell color="#663300" className={styles.userNavIcon}/>
          <span className={styles.userNavNotification}>0</span>
        </div>
        <div className={styles.userNavUser}>
          <div className={styles.userNavUserPhoto}>M</div>
          <span className={styles.userNavUserName}>Username</span>
        </div>
      </nav>
    </header>
  );
}