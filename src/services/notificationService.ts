// Push Notification & Service Worker Scheduler Service
import { sounds } from '../utils/soundEffects';
import { storageService } from './storageService';

const SENT_NOTIFS_KEY = 'pookie_sent_notifications';

export const notificationService = {
  swRegistration: null as ServiceWorkerRegistration | null,

  async init(): Promise<void> {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Only register service worker in production (HTTPS) so we never interfere with Vite development
    if ('serviceWorker' in navigator && !isLocalhost && window.location.protocol === 'https:') {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js');
        this.swRegistration = reg;
        console.log('Pookie SW registered:', reg.scope);
      } catch (err) {
        console.warn('SW registration failed:', err);
      }
    } else if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && isLocalhost) {
      // Proactively clean up any old service worker on localhost
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (const reg of regs) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then(keys => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
    }

    // Start background check for due calendar reminders
    this.startReminderWatcher();
  },

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones de escritorio o móviles.');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sounds.playSparkle();
        this.showNotification({
          title: '¡Notificaciones activadas, pookie! 💗',
          body: 'Naimnecita te avisará de tus citas y recordatorios importantes.',
          id: 'welcome-notif'
        });
      }
      return permission;
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return 'denied';
    }
  },

  async showNotification(opts: { title: string; body: string; id?: string; url?: string }): Promise<boolean> {
    const perm = this.getPermissionStatus();
    if (perm !== 'granted') return false;

    // Check deduplication
    if (opts.id && this.hasBeenSent(opts.id)) {
      return false;
    }

    sounds.playReminderChime();

    // Prefer Service Worker showNotification if active (works even when tab unfocused or closed)
    if (this.swRegistration && this.swRegistration.active) {
      try {
        await this.swRegistration.showNotification(opts.title, {
          body: opts.body,
          icon: './favicon.svg',
          badge: './favicon.svg',
          tag: opts.id || `pookie-${Date.now()}`,
          data: { url: opts.url || './' },
          actions: [
            { action: 'open', title: 'Abrir 💖' }
          ]
        } as any);
        if (opts.id) this.markAsSent(opts.id);
        return true;
      } catch (err) {
        console.warn('SW notification failed, falling back to window Notification:', err);
      }
    }

    // Fallback to standard web notification
    try {
      new Notification(opts.title, {
        body: opts.body,
        icon: './favicon.svg',
        tag: opts.id || `pookie-${Date.now()}`
      });
      if (opts.id) this.markAsSent(opts.id);
      return true;
    } catch (err) {
      console.warn('Window Notification failed:', err);
      return false;
    }
  },

  // Schedule notification via service worker message
  scheduleReminder(title: string, body: string, delayMs: number, id: string) {
    if (this.swRegistration && this.swRegistration.active) {
      this.swRegistration.active.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        title,
        body,
        delayMs,
        id
      });
    } else {
      setTimeout(() => {
        this.showNotification({ title, body, id });
      }, delayMs);
    }
  },

  hasBeenSent(id: string): boolean {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SENT_NOTIFS_KEY) || '[]');
      return list.includes(id);
    } catch {
      return false;
    }
  },

  markAsSent(id: string): void {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SENT_NOTIFS_KEY) || '[]');
      if (!list.includes(id)) {
        list.push(id);
        // keep last 100
        localStorage.setItem(SENT_NOTIFS_KEY, JSON.stringify(list.slice(-100)));
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Periodic watcher for calendar reminders (every 20s)
  startReminderWatcher(): void {
    setInterval(() => {
      this.checkDueReminders();
    }, 20000);
  },

  checkDueReminders(): void {
    const events = storageService.getEvents();
    const now = new Date();

    events.forEach(event => {
      if (event.isCompleted) return;
      if (!event.date || !event.startTime) return;

      const eventDateTime = new Date(`${event.date}T${event.startTime}:00`);
      const reminderMinutes = event.reminderMinutes || 15;
      const reminderTime = new Date(eventDateTime.getTime() - reminderMinutes * 60000);

      const diffMs = reminderTime.getTime() - now.getTime();
      // If due within the last 2 minutes and not more than 2 minutes past
      if (diffMs <= 0 && diffMs > -120000) {
        const notifId = `event-${event.id}-${event.date}-${event.startTime}`;
        if (!this.hasBeenSent(notifId)) {
          this.showNotification({
            title: `Recordatorio: ${event.title} 💗`,
            body: `Comienza a las ${event.startTime}. ¡Naimnecita te desea lo mejor! ✨`,
            id: notifId
          });
          storageService.addNotification({
            title: `Recordatorio: ${event.title}`,
            message: `Evento programado para las ${event.startTime}.`,
            type: 'reminder'
          });
        }
      }
    });
  }
};
