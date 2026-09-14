import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
  Review,
  NotificationItem,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'euresolvo_users_v2',
  PROFESSIONALS: 'euresolvo_professionals_v2',
  REQUESTS: 'euresolvo_requests_v2',
  APPLICATIONS: 'euresolvo_applications_v2',
  REVIEWS: 'euresolvo_reviews_v2',
  NOTIFICATIONS: 'euresolvo_notifications_v2',
  CURRENT_USER_ID: 'euresolvo_current_user_id_v1',
  FAVORITES: 'euresolvo_favorites_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage set error:', e);
  }
}

export const AppStorage = {
  getUsers: (): UserProfile[] => safeGet(STORAGE_KEYS.USERS, []),
  setUsers: (users: UserProfile[]) => safeSet(STORAGE_KEYS.USERS, users),

  getProfessionals: (): ProfessionalProfile[] =>
    safeGet(STORAGE_KEYS.PROFESSIONALS, []),
  setProfessionals: (pros: ProfessionalProfile[]) =>
    safeSet(STORAGE_KEYS.PROFESSIONALS, pros),

  getRequests: (): ServiceRequest[] =>
    safeGet(STORAGE_KEYS.REQUESTS, []),
  setRequests: (requests: ServiceRequest[]) =>
    safeSet(STORAGE_KEYS.REQUESTS, requests),

  getApplications: (): ServiceApplication[] =>
    safeGet(STORAGE_KEYS.APPLICATIONS, []),
  setApplications: (apps: ServiceApplication[]) =>
    safeSet(STORAGE_KEYS.APPLICATIONS, apps),

  getReviews: (): Review[] => safeGet(STORAGE_KEYS.REVIEWS, []),
  setReviews: (reviews: Review[]) => safeSet(STORAGE_KEYS.REVIEWS, reviews),

  getNotifications: (): NotificationItem[] =>
    safeGet(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (notifs: NotificationItem[]) =>
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getCurrentUserId: (): string =>
    safeGet(STORAGE_KEYS.CURRENT_USER_ID, 'user_contractor_1'),
  setCurrentUserId: (id: string) => safeSet(STORAGE_KEYS.CURRENT_USER_ID, id),

  getFavorites: (): string[] => safeGet(STORAGE_KEYS.FAVORITES, ['pro_1']),
  setFavorites: (favs: string[]) => safeSet(STORAGE_KEYS.FAVORITES, favs),

  resetAll: () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROFESSIONALS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  },
};
