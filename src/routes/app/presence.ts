import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// How often the heartbeat is written. The admin dashboard's "online"
// threshold (AdminApp.tsx) is set generously above this so one missed
// beat doesn't flip someone to offline.
export const PRESENCE_INTERVAL_MS = 25_000;

export async function writePresenceHeartbeat(uid: string) {
  if (!db) return;
  await setDoc(
    doc(db, 'presence', uid),
    { lastActiveAt: new Date().toISOString(), serverLastActiveAt: serverTimestamp(), platform: 'web' },
    { merge: true }
  ).catch(() => {});
}
