'use client';
import { useState } from 'react';
import { User, Item } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import styles from './Shop.module.scss';
import { Gem, ShoppingBag } from 'lucide-react';
import { buyItemAction } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

interface ShopClientProps {
  items: Item[];
  currentUser: User | null;
  ownedItemIds: string[];
  token: string | null;
}

interface ItemCardProps {
  item: Item;
  isOwned: boolean;
  userGems: number;
  token: string | null;
  onPurchase: (gems: number) => void;
}

function ItemCard({ item, isOwned, userGems, token, onPurchase }: ItemCardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const canAfford = userGems >= item.price;

  const handleBuy = async () => {
    if (!token || isOwned || !canAfford) return;
    setLoading(true);
    setError('');

    const result = await buyItemAction(item._id, token);

    if (result && 'error' in result) {
      setError(result.error);
    } else if (result && 'success' in result) {
      onPurchase(result.gems);
    }

    setLoading(false);
  };

  return (
    <div className={`${styles.itemCard} ${isOwned ? styles.owned : ''}`}>
      {/* Item Preview */}
      <div className={styles.previewArea}>
        {item.itemType === 'color' && (
          <div className={styles.colorPreview}>
            <div
              className={styles.colorCircle}
              style={{ backgroundColor: item.value }}
            />
            <span className={styles.previewLabel}>Profile Color</span>
          </div>
        )}
        {item.itemType === 'frame' && (
          <div className={styles.framePreview}>
            <div
              className={styles.frameCircle}
              style={{ borderColor: item.value }}
            >
              <span>G</span>
            </div>
            <span className={styles.previewLabel}>Avatar Frame</span>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemDesc}>{item.description}</p>
      </div>

      {/* Price and Buy */}
      <div className={styles.itemFooter}>
        <div className={styles.price}>
          <Gem size={14} color="#6cb6ff" />
          <span>{item.price}</span>
        </div>

        {isOwned ? (
          <span className={styles.ownedBadge}>✅ Owned</span>
        ) : (
          <button
            onClick={handleBuy}
            disabled={loading || !canAfford}
            className={`${styles.buyBtn} ${!canAfford ? styles.cantAfford : ''}`}
            title={!canAfford ? 'Not enough gems!' : ''}
          >
            {loading ? '...' : !canAfford ? '💎 Need more gems' : 'Buy'}
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default function ShopClient({ items, currentUser, ownedItemIds, token }: ShopClientProps) {
  const router = useRouter();
  const [gems, setGems] = useState<number>(currentUser?.gems || 0);
  const [owned, setOwned] = useState<string[]>(ownedItemIds);

  const handlePurchase = (newGems: number, itemId: string) => {
    setGems(newGems);
    setOwned(prev => [...prev, itemId]);
    router.refresh();
  };

  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={24} color="#663300" />
            <h1>The Goldmine Shop</h1>
          </div>
          <div className={styles.gemBalance}>
            <Gem size={18} color="#6cb6ff" />
            <span>{gems} gems</span>
          </div>
        </div>

        <p className={styles.subtitle}>
          Spend your hard-earned gems on cosmetic items!
        </p>

        {/* Items Grid */}
        {items.length > 0 ? (
          <>
            <h2 className={styles.categoryTitle}>🎨 Colors</h2>
            <div className={styles.grid}>
              {items
                .filter(item => item.itemType === 'color')
                .map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    isOwned={owned.includes(item._id)}
                    userGems={gems}
                    token={token}
                    onPurchase={(newGems) => handlePurchase(newGems, item._id)}
                  />
                ))}
            </div>

            <h2 className={styles.categoryTitle}>🖼️ Frames</h2>
            <div className={styles.grid}>
              {items
                .filter(item => item.itemType === 'frame')
                .map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    isOwned={owned.includes(item._id)}
                    userGems={gems}
                    token={token}
                    onPurchase={(newGems) => handlePurchase(newGems, item._id)}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <p>Shop is empty. Check back later!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}