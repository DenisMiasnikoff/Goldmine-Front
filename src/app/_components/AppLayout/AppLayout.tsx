'use client';
import { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AppLayout.module.scss';
import { User } from '@/app/_types/DashboardPost';




interface AppLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
}


export default function AppLayout({ children, currentUser }: AppLayoutProps) {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
  <div className={styles.container}>
    <Header onLogoClick={toggleSidebar} currentUser={currentUser} />
    <div className={styles.content}>
      <Sidebar isVisible={isSidebarVisible} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  </div>
);
}