'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/app/_types/DashboardPost';
import AppLayout from '@/app/_components/AppLayout/AppLayout';
import styles from './Settings.module.scss';
import { updateMeAction } from '@/app/_lib/actions';

interface SettingsClientProps {
  currentUser: User;
  token: string | null;
}

export default function SettingsClient({ currentUser, token }: SettingsClientProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>(currentUser.username);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const result = await updateMeAction(username, email, token);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess('Profile updated successfully!');
      router.refresh();
    }

    setIsSubmitting(false);
  };

  return (
    <AppLayout currentUser={currentUser}>
      <div className={styles.page}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>🚨 {error}</p>}
          {success && <p className={styles.success}>✅ {success}</p>}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={styles.saveBtn}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <p className={styles.dangerText}>
            Want to delete your account? Contact support.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}