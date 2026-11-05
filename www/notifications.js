import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const VERSE_ID_START = 92000;
const VERSE_ID_END = 93000;
const verses = [
  { text: 'ألا بذكر الله تطمئن القلوب', ref: 'الرعد: 28' },
  { text: 'فاذكروني أذكركم واشكروا لي ولا تكفرون', ref: 'البقرة: 152' },
  { text: 'ومن يتوكل على الله فهو حسبه', ref: 'الطلاق: 3' },
  { text: 'فإن مع العسر يسرا إن مع العسر يسرا', ref: 'الشرح: 5-6' },
  { text: 'لا يكلف الله نفسا إلا وسعها', ref: 'البقرة: 286' },
  { text: 'وقل رب زدني علما', ref: 'طه: 114' },
  { text: 'رب اشرح لي صدري ويسر لي أمري', ref: 'طه: 25-26' },
  { text: 'إن الله مع الصابرين', ref: 'البقرة: 153' }
];

function setStatus(message) {
  const el = document.getElementById('notificationStatus');
  if (el) el.textContent = message;
}

async function cancelVerseNotifications() {
  const pending = await LocalNotifications.getPending();
  const notifications = (pending.notifications || [])
    .filter(item => item.id >= VERSE_ID_START && item.id < VERSE_ID_END)
    .map(item => ({ id: item.id }));
  if (notifications.length) {
    await LocalNotifications.cancel({ notifications });
  }
}

window.enableVerseNotifications = async function () {
  try {
    if (!Capacitor.isNativePlatform()) {
      setStatus('إشعارات الآيات متاحة في نسخة Android المثبتة.');
      return;
    }
    if (!navigator.onLine) {
      setStatus('اتصل بالإنترنت أولاً لتحميل جدول الآيات ثم أعد المحاولة.');
      return;
    }
    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      permission = await LocalNotifications.requestPermissions();
    }
    if (permission.display !== 'granted') {
      setStatus('لم يتم منح إذن الإشعارات. يمكنك تفعيله من إعدادات الهاتف.');
      return;
    }

    await cancelVerseNotifications();
    const notifications = [];
    const now = new Date();
    const windows = [{ start: 8, end: 10 }, { start: 13, end: 16 }, { start: 18, end: 21 }];

    for (let day = 0; day < 14; day++) {
      for (let slot = 0; slot < windows.length; slot++) {
        const window = windows[slot];
        const at = new Date(now);
        at.setDate(now.getDate() + day);
        at.setHours(window.start + Math.floor(Math.random() * (window.end - window.start)), Math.floor(Math.random() * 60), 0, 0);
        if (at <= now) continue;
        const verse = verses[Math.floor(Math.random() * verses.length)];
        notifications.push({
          id: VERSE_ID_START + day * 3 + slot,
          title: 'آية تذكير',
          body: verse.text + ' — ' + verse.ref,
          schedule: { at, allowWhileIdle: true },
          extra: { type: 'quran-verse', reference: verse.ref }
        });
      }
    }

    if (!notifications.length) {
      setStatus('تعذر إعداد مواعيد مستقبلية. حاول مرة أخرى.');
      return;
    }
    await LocalNotifications.schedule({ notifications });
    setStatus('تم تفعيل الإشعارات وجدولة آيات عشوائية لمدة 14 يوماً. لا تحتاج الآيات المجدولة إلى الإنترنت وقت وصول الإشعار.');
  } catch (error) {
    setStatus('تعذر تفعيل الإشعارات: ' + (error?.message || 'خطأ غير معروف'));
  }
};

window.disableVerseNotifications = async function () {
  try {
    if (!Capacitor.isNativePlatform()) {
      setStatus('هذه الميزة تعمل في نسخة Android المثبتة.');
      return;
    }
    await cancelVerseNotifications();
    setStatus('تم إيقاف إشعارات الآيات المجدولة.');
  } catch (error) {
    setStatus('تعذر إيقاف الإشعارات: ' + (error?.message || 'خطأ غير معروف'));
  }
};
