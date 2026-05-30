'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User as UserIcon, Settings, Gem } from 'lucide-react';
import styles from './Header.module.scss';
import { logoutAction } from '../../_lib/actions';
import { User } from '@/app/_types/DashboardPost';

interface HeaderProps {
  onLogoClick: () => void;
  currentUser: User | null;
}

export default function Header({ onLogoClick, currentUser }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const username = currentUser?.username || 'Guest';
  const gems = currentUser?.gems || 0;
  const userInitial = currentUser?.username
    ? currentUser.username.charAt(0).toUpperCase()
    : 'G';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={onLogoClick} style={{ cursor: 'pointer' }}>
        <span>Goldmine</span>
      </div>

      <form onSubmit={handleSearch} className={styles.search}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          <span className={styles.searchIcon}>🔍</span>
        </button>
      </form>

      <nav className={styles.userNav}>
        {currentUser && (
          <div
            className={styles.userNavIconBox}
            title="Your Gems"
            style={{ marginRight: '10px', color: '#663300', fontWeight: 'bold' }}
          >
            <Gem color="#6cb6ff" />
            <span>{gems}</span>
          </div>
        )}

        <div className={styles.userNavIconBox}>
          <Bell color="#663300" className={styles.userNavIcon} />
          <span className={styles.userNavNotification}>0</span>
        </div>

        <div className={styles.userNavUser} ref={dropdownRef}>
          <div
            className={styles.userNavUserPhoto}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            {userInitial}
          </div>
          <span
            className={styles.userNavUserName}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </span>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem}
               onClick={() => router.push(`/profile/${username}`)}>
               <UserIcon size={16} color="#663300" />
             <span>Profile</span>
             </button>
            <button className={styles.dropdownItem} onClick={() => {
              setIsDropdownOpen(false);
              router.push('/settings'); }}>
            <Settings size={16} color="#663300" />
             <span>Settings</span>
            </button>
              <div className={styles.dropdownDivider} />
              <form action={logoutAction}>
                <button type="submit" className={styles.dropdownItem}>
                  <LogOut size={16} color="#663300" />
                  <span>Log out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}