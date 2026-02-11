import { useUserStore } from '@/stores/userStore';
import i18n from '@/configs/i18n';

let wakeLock: WakeLockSentinel | null = null;

export const toggleWakeLock = async () => {
  const userStore = useUserStore();
  userStore.connectionError = '';

  if (!('wakeLock' in navigator)) {
    userStore.connectionError = i18n.global.t('auth.wakeLockNotSupported');
    return;
  }

  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
    } catch (err) {
      userStore.connectionError = `${i18n.global.t('auth.wakeLockReleaseError')}: ${err}`;
    }
  } else {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    } catch (err) {
      userStore.connectionError = `${i18n.global.t('auth.wakeLockRequestError')}: ${err}`;
    }
  }
};
