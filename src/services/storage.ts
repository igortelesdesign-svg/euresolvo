import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
  Review,
  NotificationItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROFESSIONALS,
  INITIAL_REQUESTS,
  INITIAL_APPLICATIONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'euresolvo_users_v1',
  PROFESSIONALS: 'euresolvo_professionals_v1',
  REQUESTS: 'euresolvo_requests_v1',
  APPLICATIONS: 'euresolvo_applications_v1',
  REVIEWS: 'euresolvo_reviews_v1',
  NOTIFICATIONS: 'euresolvo_notifications_v1',
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
  getUsers: (): UserProfile[] => safeGet(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: UserProfile[]) => safeSet(STORAGE_KEYS.USERS, users),

  getProfessionals: (): ProfessionalProfile[] =>
    safeGet(STORAGE_KEYS.PROFESSIONALS, INITIAL_PROFESSIONALS),
  setProfessionals: (pros: ProfessionalProfile[]) =>
    safeSet(STORAGE_KEYS.PROFESSIONALS, pros),

  getRequests: (): ServiceRequest[] => {
    const saved = safeGet<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, []);

    const savedIds = new Set(saved.map((request) => request.id));

    const missingInitialRequests = INITIAL_REQUESTS.filter(
      (request) => !savedIds.has(request.id)
    );

    return [...saved, ...missingInitialRequests];
  },
  setRequests: (requests: ServiceRequest[]) =>
    safeSet(STORAGE_KEYS.REQUESTS, requests),

  getApplications: (): ServiceApplication[] =>
    safeGet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS),
  setApplications: (apps: ServiceApplication[]) =>
    safeSet(STORAGE_KEYS.APPLICATIONS, apps),

  getReviews: (): Review[] => safeGet(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS),
  setReviews: (reviews: Review[]) => safeSet(STORAGE_KEYS.REVIEWS, reviews),

  getNotifications: (): NotificationItem[] =>
    safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
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
