export type UserRole = 'professional' | 'contractor' | 'admin';

export type ContractorType = 
  | 'individual' 
  | 'condominium' 
  | 'property_manager' 
  | 'company' 
  | 'store' 
  | 'school' 
  | 'clinic' 
  | 'hotel' 
  | 'restaurant';

export type ServiceStatus = 
  | 'open' 
  | 'receiving_applications' 
  | 'professional_selected' 
  | 'scheduled' 
  | 'in_progress' 
  | 'resolved' 
  | 'cancelled';

export type ApplicationStatus = 'interested' | 'shortlisted' | 'selected' | 'rejected' | 'cancelled';

export type UrgencyLevel = 'low' | 'normal' | 'urgent' | 'emergency';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  professionalName?: string;
  role: UserRole;
  phone?: string;
  whatsapp?: string;
  whatsappNotifications?: boolean;
  avatarUrl?: string;
  city: string;
  state: string;
  neighborhood?: string;
  cpf?: string;
  cnpj?: string;
  hasCnpj?: boolean;
  contractorType?: ContractorType;
  organizationName?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  popularServices: string[];
  description: string;
}

export interface DayAvailability {
  dayOfWeek: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  dayLabel: string;
  enabled: boolean;
  slots: {
    start: string;
    end: string;
  }[];
}

export interface ProfessionalBadge {
  id: string;
  code: 'verified' | 'top_rated' | 'punctual' | 'fast_solver' | 'highly_hired' | 'quick_reply' | 'new';
  label: string;
  description: string;
  color: string;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  bio: string;
  mainCategory: string;
  categories: string[];
  subcategories: string[];
  experienceYears: number;
  inPersonService: boolean;
  remoteService: boolean;
  emergencyService: boolean;
  serviceAreas: string[];
  rating: number;
  totalReviews: number;
  resolvedCount: number;
  completionRate: number; // e.g. 98
  isAvailableNow: boolean;
  weeklySchedule: DayAvailability[];
  badges: ProfessionalBadge[];
  vacationUntil?: string | null;
  score: number;
}

export interface ServiceRequest {
  id: string;
  contractorId: string;
  contractorName: string;
  contractorType: ContractorType;
  organizationName?: string;
  contractorAvatar?: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  city: string;
  state: string;
  neighborhood: string;
  address?: string;
  serviceDate: string; // YYYY-MM-DD or 'hoje', 'amanha'
  dateLabel?: string;
  startTime: string;
  endTime: string;
  timeSlot?: 'agora' | 'manha' | 'tarde' | 'noite' | 'personalizado';
  urgency: UrgencyLevel;
  status: ServiceStatus;
  images: string[];
  photosCount?: number;
  distanceKm?: number;
  selectedProfessionalId?: string;
  selectedProfessionalName?: string;
  contactUnlocked?: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface ServiceApplication {
  id: string;
  requestId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  professionalCategory: string;
  rating: number;
  resolvedCount: number;
  completionRate: number;
  status: ApplicationStatus;
  message?: string;
  appliedAt: string;
  distanceKm?: number;
  isAvailableMatch?: boolean;
}

export interface ReviewCriteria {
  quality: number;
  punctuality: number;
  communication: number;
  organization: number;
  professionalism: number;
}

export interface Review {
  id: string;
  requestId: string;
  serviceTitle: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetId: string;
  targetName: string;
  rating: number;
  criteria: ReviewCriteria;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'opportunity' | 'application' | 'selected' | 'reminder' | 'resolved' | 'review' | 'system';
  read: boolean;
  requestId?: string;
  createdAt: string;
}

export interface AdminMetrics {
  totalUsers: number;
  totalProfessionals: number;
  totalContractors: number;
  openOpportunities: number;
  resolvedServices: number;
  completionRate: number;
  averageRating: number;
  topCities: { city: string; count: number }[];
  topCategories: { category: string; count: number }[];
}
