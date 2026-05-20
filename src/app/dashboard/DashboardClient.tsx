"use client"
import { useState } from "react";
import styles from "../_components/_Dashboard/Dashboard.module.scss";
import Header from "../_components/Header/Header";
import Sidebar from '../_components/Sidebar/Sidebar';
import MainContent from '../_components/MainContent/MainContent';
import { Post } from '../_types';

interface DashboardClientProps {
  posts: Post[];
  dungeonId: string;
  token: string | null;
}

export default function DashboardClient({ posts, dungeonId, token }: DashboardClientProps) {
  const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  return (
    <div className={styles.container}>
      <Header onLogoClick={toggleSidebar} />
      
      <div className={styles.content}>
        <Sidebar isVisible={isSideBarVisible} />
        
        <MainContent 
          posts={posts} 
          dungeonId={dungeonId} 
          token={token} 
        />
      </div>
    </div>
  );
}