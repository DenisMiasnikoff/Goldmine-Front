'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, User as UserIcon, Settings, Gem } from 'lucide-react';
import styles from './Header.module.scss';
import { logoutAction } from '../../_lib/actions';
import { User } from '@/app/_types/DashboardPost';

interface HeaderProps {
  onLogoClick: () => void;
  currentUser: User | null;
}

// 1. We added currentUser right here so the component can actually use it!
export default function Header({ onLogoClick, currentUser }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Extract our dynamic user data safely (with fallbacks just in case)
  const username = currentUser?.username || 'Guest';
  const gems = currentUser?.gems || 0;
  const userInitial = currentUser?.username 
    ? currentUser.username.charAt(0).toUpperCase() 
    : 'G';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        {/* The New Gamified Feature: Gem Counter */}
        {currentUser && (
          <div 
            className={styles.userNavIconBox} 
            title="Your Gems" 
            style={{ marginRight: '10px', color: '#663300', fontWeight: 'bold' }}
          >
           <Gem color="#6cb6ff" /> <span>{gems}</span>
            
          </div>
        )}

        <div className={styles.userNavIconBox}>
          <Bell color="#663300" className={styles.userNavIcon}/>
          <span className={styles.userNavNotification}>0</span>
        </div>

        {/* Dropdown wrapper */}
        <div className={styles.userNavUser} ref={dropdownRef}>
          <div
            className={styles.userNavUserPhoto}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{cursor: 'pointer'}}
          >
            {/* 3. Injecting the real initial here */}
            {userInitial}
          </div>
          <span
            className={styles.userNavUserName}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{cursor: 'pointer'}}
          >
            {/* 4. Injecting the real username here */}
            {username}
          </span>

          {/* Dropdown menu (Unchanged, your Claude logic was perfect) */}
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem}>
                <UserIcon size={16} color="#663300" />
                <span>Profile</span>
              </button>
              <button className={styles.dropdownItem}>
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