
export enum PrayerType {
  Fajr = 'Fajr',
  Dhuhr = 'Dhuhr',
  Asr = 'Asr',
  Maghrib = 'Maghrib',
  Isha = 'Isha'
}

export interface PrayerTime {
  prayerType: PrayerType;
  time: string; // ISO string
}

export interface MissedPrayer {
  id: string;
  prayerType: PrayerType;
  count: number;
}

export interface PrayerMakeupPlan {
  id: string;
  name: string;
  targetPrayers: MissedPrayer[];
  makeupStrategy: MakeupStrategy;
  notificationStrategy: NotificationStrategy;
  createdAt: string; // ISO string
  completedCount: number;
  totalCount: number;
}

export enum MakeupStrategy {
  WithCurrentPrayer = 'WithCurrentPrayer',
  SpecificPrayerOnly = 'SpecificPrayerOnly',
  AnyTime = 'AnyTime'
}

export enum NotificationStrategy {
  WithEachPrayer = 'WithEachPrayer',
  SpecificTimeDaily = 'SpecificTimeDaily',
  None = 'None'
}

export interface PrayerProgress {
  date: string; // ISO string
  prayerType: PrayerType;
  count: number;
}
