'use client';
import { useState } from 'react';
import { Dungeon } from '@/app/_types/DashboardPost';
import { User } from '@/app/_types/DashboardPost';
import { subscribeToDungeonAction } from '@/app/_lib/actions';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import styles from './Dungeons.module.scss';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DungeonsClientProps {
  dungeons: Dungeon[];
  subscriptions: string[];
  token: string | null;
  currentUser: User | null;
}

interface DungeonCardProps {
  dungeon: Dungeon;
  isSubscribed: boolean;
  token: string | null;
}

function DungeonCard({ dungeon, isSubscribed, token }: DungeonCardProps) {
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    const result = await subscribeToDungeonAction(dungeon._id, token);
    if (result && 'message' in result) {
      setSubscribed(result.message === 'Subscribed!');
    }

    setLoading(false);
  };

  return (
    <div className={styles.dungeonCard}>
      <div className={styles.dungeonBanner} style={{ backgroundColor: '#8c7851' }} />
      <div className={styles.dungeonBody}>
        <div className={styles.dungeonInfo}>
          <h3 className={styles.dungeonName}>d/{dungeon.name}</h3>
          <p className={styles.dungeonDesc}>
            {dungeon.description || 'A mysterious dungeon awaits...'}
          </p>
        </div>
        <div className={styles.dungeonActions}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={subscribed ? styles.unsubscribeBtn : styles.subscribeBtn}
          >
            {loading ? '...' : subscribed ? 'Joined' : 'Join'}
          </button>
          <Link href={`/dungeons/${dungeon._id}`} className={styles.enterBtn}>
            Enter <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DungeonsClient({ dungeons, subscriptions, token, currentUser }: DungeonsClientProps) {
  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Explore Dungeons</h1>
          <p>Find your community and join the adventure</p>
        </div>

        {dungeons.length > 0 ? (
          <div className={styles.grid}>
            {dungeons.map(dungeon => (
              <DungeonCard
                key={dungeon._id}
                dungeon={dungeon}
                isSubscribed={subscriptions.includes(dungeon._id)}
                token={token}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No dungeons yet. Be the first to forge one!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}