'use client';
import { useState } from 'react';
import { User, Item } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import styles from './Profile.module.scss';
import { Gem, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import { equipItemAction } from '@/app/_lib/actions';

interface ProfileUser extends User {
  inventory: Item[];
  createdAt: string;
  role: string;
  activeColor?: string;
}

interface ProfileClientProps {
  profileUser: ProfileUser;
  currentUser: User | null;
  isOwnProfile: boolean;
  token: string | null;
}

export default function ProfileClient({
  profileUser,
  currentUser,
  isOwnProfile,
  token
}: ProfileClientProps) {
  const userInitial = profileUser.username.charAt(0).toUpperCase();
  const joinDate = profileUser.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      })
    : 'Unknown';

  const [activeColor, setActiveColor] = useState<string | undefined>(
    profileUser.activeColor
  );

  const handleEquip = async (item: Item) => {
    if (!token || item.itemType !== 'color') return;
    const result = await equipItemAction(item._id, token);
    if (result && 'activeColor' in result) {
      setActiveColor(result.activeColor || undefined);
    }
  };

  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>

        {/* Profile Header */}
        <div
          className={styles.profileCard}
          style={{
            backgroundColor: activeColor || 'white',
            transition: 'background-color 0.3s ease'
          }}
        >
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {userInitial}
              </div>
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.username}>{profileUser.username}</h1>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Calendar size={14} />
                  Joined {joinDate}
                </span>
                <span className={styles.metaItem}>
                  <Gem size={14} color="#6cb6ff" />
                  {profileUser.gems} gems
                </span>
                <span className={styles.metaItem}>
                  <Shield size={14} />
                  {profileUser.role}
                </span>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Link href="/settings" className={styles.editBtn}>
              Edit Profile
            </Link>
          )}
        </div>

        {/* Inventory Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Inventory</h2>

          {profileUser.inventory?.length > 0 ? (
            <div className={styles.inventoryGrid}>
              {profileUser.inventory.map((item: Item) => (
                <div key={item._id} className={styles.inventoryItem}>

                  {/* Color preview */}
                  {item.itemType === 'color' && (
                    <>
                      <div
                        className={styles.colorPreview}
                        style={{ backgroundColor: item.value }}
                      />
                      {isOwnProfile && (
                        <button
                          className={`${styles.equipBtn} ${activeColor === item.value ? styles.equipped : ''}`}
                          onClick={() => handleEquip(item)}
                        >
                          {activeColor === item.value ? 'Unequip' : 'Equip'}
                        </button>
                      )}
                    </>
                  )}

                  {/* Frame preview */}
                  {item.itemType === 'frame' && (
                    <div
                      className={styles.framePreview}
                      style={{ borderColor: item.value }}
                    >
                      <span>{userInitial}</span>
                    </div>
                  )}

                  <p className={styles.itemName}>{item.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyInventory}>
              <p>No items yet.</p>
              <Link href="/shop" className={styles.shopLink}>
                Visit the Shop
              </Link>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}