'use client';
import { useState } from 'react';
import { Dungeon, User } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import styles from './MyDungeons.module.scss';
import { Plus, Edit2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { forgeDungeon, updateDungeonAction } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

interface MyDungeonsClientProps {
  dungeons: Dungeon[];
  token: string | null;
  currentUser: User | null;
}

interface EditFormProps {
  dungeon: Dungeon;
  token: string | null;
  onClose: () => void;
}

function EditDungeonForm({ dungeon, token, onClose }: EditFormProps) {
  const [name, setName] = useState<string>(dungeon.name);
  const [description, setDescription] = useState<string>(dungeon.description || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!token || !name.trim()) return;
    setIsSubmitting(true);
    setError('');

    const result = await updateDungeonAction(dungeon._id, name, description, token);

    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
      onClose();
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.editForm}>
      <h3 className={styles.editTitle}>Edit d/{dungeon.name}</h3>

      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          maxLength={21}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          rows={3}
          maxLength={500}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.editActions}>
        <button onClick={onClose} className={styles.cancelBtn}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={styles.saveBtn}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

interface CreateFormProps {
  token: string | null;
  onClose: () => void;
}

function CreateDungeonForm({ token, onClose }: CreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await forgeDungeon(formData, token);

    if (result !== undefined && 'error' in result) {
      setError(result.error);
    } else {
      router.refresh();
      onClose();
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.createForm}>
      <h3 className={styles.editTitle}>Create a New Dungeon</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            placeholder="dungeon-name"
            className={styles.input}
            maxLength={21}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="What is this dungeon about?"
            className={styles.textarea}
            rows={3}
            maxLength={500}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.editActions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.saveBtn}
          >
            {isSubmitting ? 'Forging...' : 'Forge Dungeon'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function MyDungeonsClient({ dungeons, token, currentUser }: MyDungeonsClientProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <h1>My Dungeons</h1>
          <button
            className={styles.createBtn}
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus size={16} />
            Forge Dungeon
          </button>
        </div>

        {/* Create form */}
        {isCreating && (
          <CreateDungeonForm
            token={token}
            onClose={() => setIsCreating(false)}
          />
        )}

        {/* Dungeon list */}
        {dungeons.length > 0 ? (
          <div className={styles.list}>
            {dungeons.map(dungeon => (
              <div key={dungeon._id} className={styles.dungeonRow}>

                {/* Dungeon info or edit form */}
                {editingId === dungeon._id ? (
                  <EditDungeonForm
                    dungeon={dungeon}
                    token={token}
                    onClose={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className={styles.dungeonInfo}>
                      <h3 className={styles.dungeonName}>d/{dungeon.name}</h3>
                      <p className={styles.dungeonDesc}>
                        {dungeon.description || 'No description yet'}
                      </p>
                    </div>
                    <div className={styles.dungeonActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditingId(dungeon._id)}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <Link
                        href={`/dungeons/${dungeon._id}`}
                        className={styles.enterBtn}
                      >
                        Enter <ArrowRight size={14} />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>⛏️ You havent created any dungeons yet.</p>
            <Link href="/dungeons" className={styles.exploreLink}>
              Explore Dungeons
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}