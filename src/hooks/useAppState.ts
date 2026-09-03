import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  ProfessionalProfile,
  ServiceRequest,
  ServiceApplication,
  Review,
  NotificationItem,
  DayAvailability,
  ReviewCriteria,
} from '../types';
import { AppStorage } from '../services/storage';
import confetti from 'canvas-confetti';

export type ActiveView =
  | 'home'
  | 'find_professionals'
  | 'opportunities_wall'
  | 'professional_dashboard'
  | 'contractor_dashboard'
  | 'schedule'
  | 'favorites'
  | 'notifications'
  | 'for_companies'
  | 'admin'
  | 'professional_profile'
  | 'service_detail';

export interface SearchFilters {
  query: string;
  category: string;
  city: string;
  neighborhood: string;
  when: string; // 'hoje', 'amanha', 'qualquer'
  timeSlot: string; // 'todos', 'agora', 'manha', 'tarde', 'noite'
  onlyAvailableNow: boolean;
}

export const DEFAULT_WEEKLY_SCHEDULE: DayAvailability[] = [
  {
    dayOfWeek: 'segunda',
    dayLabel: 'Segunda',
    enabled: true,
    slots: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    dayOfWeek: 'terca',
    dayLabel: 'Terça',
    enabled: true,
    slots: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    dayOfWeek: 'quarta',
    dayLabel: 'Quarta',
    enabled: true,
    slots: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    dayOfWeek: 'quinta',
    dayLabel: 'Quinta',
    enabled: true,
    slots: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    dayOfWeek: 'sexta',
    dayLabel: 'Sexta',
    enabled: true,
    slots: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
  },
  {
    dayOfWeek: 'sabado',
    dayLabel: 'Sábado',
    enabled: true,
    slots: [{ start: '08:00', end: '13:00' }],
  },
  {
    dayOfWeek: 'domingo',
    dayLabel: 'Domingo',
    enabled: false,
    slots: [],
  },
];

export function useAppState() {
  const [users, setUsers] = useState<UserProfile[]>(AppStorage.getUsers);
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>(
    AppStorage.getProfessionals
  );
  const [requests, setRequests] = useState<ServiceRequest[]>(AppStorage.getRequests);
  const [applications, setApplications] = useState<ServiceApplication[]>(
    AppStorage.getApplications
  );
  const [reviews, setReviews] = useState<Review[]>(AppStorage.getReviews);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    AppStorage.getNotifications
  );
  const [currentUserId, setCurrentUserId] = useState<string>(
    AppStorage.getCurrentUserId
  );
  const [favorites, setFavorites] = useState<string[]>(AppStorage.getFavorites);

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Modals state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'role_select'>('login');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{
    requestId: string;
    proId: string;
    proName: string;
    serviceTitle: string;
  } | null>(null);

  // Active toast feedback
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'info' | 'warning';
  } | null>(null);

  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    city: 'Natal',
    neighborhood: '',
    when: '',
    timeSlot: 'todos',
    onlyAvailableNow: false,
  });

  // Keep Storage updated
  useEffect(() => {
    AppStorage.setUsers(users);
  }, [users]);

  useEffect(() => {
    AppStorage.setProfessionals(professionals);
  }, [professionals]);

  useEffect(() => {
    AppStorage.setRequests(requests);
  }, [requests]);

  useEffect(() => {
    AppStorage.setApplications(applications);
  }, [applications]);

  useEffect(() => {
    AppStorage.setReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    AppStorage.setNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    AppStorage.setCurrentUserId(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    AppStorage.setFavorites(favorites);
  }, [favorites]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
      setToast({ message, type });
      setTimeout(() => {
        setToast(null);
      }, 4000);
    },
    []
  );

  // Current User Object
  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  // If current user is professional, get profile
  const currentProProfile = useMemo(() => {
    if (currentUser?.role !== 'professional') return null;
    return professionals.find((p) => p.userId === currentUser.id) || null;
  }, [currentUser, professionals]);

  // Unread notifications
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => n.userId === currentUserId && !n.read).length;
  }, [notifications, currentUserId]);

  // Actions
  const switchUser = useCallback((userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    if (target) {
      showToast(`Alternado para: ${target.name} (${target.role})`, 'info');
      if (target.role === 'professional') {
        setActiveView('professional_dashboard');
      } else if (target.role === 'contractor') {
        setActiveView('contractor_dashboard');
      } else if (target.role === 'admin') {
        setActiveView('admin');
      }
    }
  }, [users, showToast]);

  // Professional applies with "EU RESOLVO"
  const applyToRequest = useCallback(
    (requestId: string, message?: string) => {
      if (!currentProProfile || !currentUser) {
        setAuthMode('login');
        setAuthModalOpen(true);
        showToast('Entre como profissional para demonstrar interesse', 'warning');
        return;
      }

      // Check if already applied
      const existing = applications.find(
        (a) => a.requestId === requestId && a.professionalId === currentProProfile.id
      );
      if (existing) {
        showToast('Você já demonstrou interesse nesta oportunidade!', 'info');
        return;
      }

      const req = requests.find((r) => r.id === requestId);
      if (!req) return;

      const newApp: ServiceApplication = {
        id: `app_${Date.now()}`,
        requestId,
        professionalId: currentProProfile.id,
        professionalName: currentUser.professionalName || currentUser.name,
        professionalAvatar: currentUser.avatarUrl,
        professionalCategory: currentProProfile.mainCategory,
        rating: currentProProfile.rating,
        resolvedCount: currentProProfile.resolvedCount,
        completionRate: currentProProfile.completionRate,
        status: 'interested',
        message:
          message ||
          `Olá! Eu resolvo. Estou disponível conforme os horários solicitados e tenho equipamentos completos para o atendimento.`,
        appliedAt: new Date().toISOString(),
        distanceKm: req.distanceKm || 3.5,
        isAvailableMatch: true,
      };

      setApplications((prev) => [newApp, ...prev]);

      // Update request status if was open
      if (req.status === 'open') {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, status: 'receiving_applications' } : r
          )
        );
      }

      // Add notification for the contractor
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: req.contractorId,
        title: 'Profissional disse EU RESOLVO!',
        message: `${currentUser.name} demonstrou prontidão para atender: "${req.title}".`,
        type: 'application',
        read: false,
        requestId,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      showToast('EU RESOLVO enviado com sucesso! O contratante foi notificado.', 'success');
    },
    [currentProProfile, currentUser, applications, requests, showToast]
  );

  // Contractor selects a professional
  const selectProfessional = useCallback(
    (requestId: string, proId: string) => {
      const pro = professionals.find((p) => p.id === proId);
      const proUser = users.find((u) => u.id === pro?.userId);
      const req = requests.find((r) => r.id === requestId);

      if (!req || !pro) return;

      // Update request
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'professional_selected',
                selectedProfessionalId: proId,
                selectedProfessionalName: proUser?.name || 'Profissional',
                contactUnlocked: true,
              }
            : r
        )
      );

      // Update applications statuses
      setApplications((prev) =>
        prev.map((a) => {
          if (a.requestId === requestId) {
            return a.professionalId === proId
              ? { ...a, status: 'selected' }
              : { ...a, status: 'rejected' };
          }
          return a;
        })
      );

      // Notify the selected professional
      if (pro.userId) {
        const notif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: pro.userId,
          title: 'Você foi selecionado!',
          message: `Parabéns! Você foi o profissional escolhido para o serviço: "${req.title}". Dados de contato liberados.`,
          type: 'selected',
          read: false,
          requestId,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notif, ...prev]);
      }

      showToast(
        `Profissional selecionado! Dados de contato liberados para agendamento.`,
        'success'
      );
    },
    [professionals, users, requests, showToast]
  );

  // Mark service as RESOLVED
  const markRequestResolved = useCallback(
    (requestId: string) => {
      const req = requests.find((r) => r.id === requestId);
      if (!req) return;

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'resolved',
                resolvedAt: new Date().toISOString(),
              }
            : r
        )
      );

      // Update pro resolved count & score
      if (req.selectedProfessionalId) {
        setProfessionals((prev) =>
          prev.map((p) => {
            if (p.id === req.selectedProfessionalId) {
              return {
                ...p,
                resolvedCount: p.resolvedCount + 1,
                score: p.score + 10,
              };
            }
            return p;
          })
        );
      }

      // Microinteraction: trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#45C900', '#59E600', '#071B2F', '#003A67'],
        });
      } catch {
        // silent
      }

      showToast('Serviço marcado como RESOLVIDO ✓ Parabéns!', 'success');

      // Prompt review modal for the contractor
      if (req.selectedProfessionalId) {
        setReviewModalData({
          requestId: req.id,
          proId: req.selectedProfessionalId,
          proName: req.selectedProfessionalName || 'Profissional',
          serviceTitle: req.title,
        });
      }
    },
    [requests, showToast]
  );

  // Submit review
  const submitReview = useCallback(
    (
      requestId: string,
      targetId: string,
      targetName: string,
      criteria: ReviewCriteria,
      comment: string
    ) => {
      const overall =
        (criteria.quality +
          criteria.punctuality +
          criteria.communication +
          criteria.organization +
          criteria.professionalism) /
        5;

      const req = requests.find((r) => r.id === requestId);

      const newRev: Review = {
        id: `rev_${Date.now()}`,
        requestId,
        serviceTitle: req?.title || 'Serviço Concluído',
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        targetId,
        targetName,
        rating: Number(overall.toFixed(1)),
        criteria,
        comment,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newRev, ...prev]);

      // Recalculate pro rating
      setProfessionals((prev) =>
        prev.map((p) => {
          if (p.id === targetId) {
            const nextTotal = p.totalReviews + 1;
            const nextRating = Number(
              ((p.rating * p.totalReviews + overall) / nextTotal).toFixed(1)
            );
            return {
              ...p,
              rating: nextRating,
              totalReviews: nextTotal,
              score: p.score + 5,
            };
          }
          return p;
        })
      );

      setReviewModalData(null);
      showToast('Avaliação publicada com sucesso! Obrigado pelo feedback.', 'success');
    },
    [currentUser, requests, showToast]
  );

  // Toggle "ESTOU DISPONÍVEL AGORA"
  const toggleAvailableNow = useCallback(() => {
    if (!currentProProfile) return;
    const nextState = !currentProProfile.isAvailableNow;

    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === currentProProfile.id ? { ...p, isAvailableNow: nextState } : p
      )
    );

    showToast(
      nextState
        ? 'Status alterado: DISPONÍVEL AGORA 🟢 Você aparecerá no topo das buscas imediatas!'
        : 'Status de disponibilidade imediata desativado.',
      'info'
    );
  }, [currentProProfile, showToast]);

  // Update weekly schedule
  const updateWeeklySchedule = useCallback(
    (schedule: DayAvailability[]) => {
      if (!currentProProfile) return;
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === currentProProfile.id ? { ...p, weeklySchedule: schedule } : p
        )
      );
      showToast('Agenda de disponibilidade semanal atualizada com sucesso!', 'success');
    },
    [currentProProfile, showToast]
  );

  // Toggle Favorite
  const toggleFavorite = useCallback(
    (proId: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(proId);
        const updated = exists ? prev.filter((id) => id !== proId) : [...prev, proId];
        showToast(
          exists ? 'Profissional removido dos favoritos' : 'Profissional salvo nos favoritos ⭐',
          'info'
        );
        return updated;
      });
    },
    [showToast]
  );

  // Publish new Service Demand
  const publishRequest = useCallback(
    (data: {
      title: string;
      description: string;
      categoryId: string;
      categoryName: string;
      city: string;
      state: string;
      neighborhood: string;
      address?: string;
      serviceDate: string;
      dateLabel?: string;
      startTime: string;
      endTime: string;
      timeSlot?: 'agora' | 'manha' | 'tarde' | 'noite' | 'personalizado';
      urgency: 'low' | 'normal' | 'urgent' | 'emergency';
      images?: string[];
    }) => {
      const newReq: ServiceRequest = {
        id: `req_${Date.now()}`,
        contractorId: currentUser.id,
        contractorName: currentUser.organizationName || currentUser.name,
        contractorType: currentUser.contractorType || 'individual',
        organizationName: currentUser.organizationName,
        contractorAvatar: currentUser.avatarUrl,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        city: data.city || 'Natal',
        state: data.state || 'RN',
        neighborhood: data.neighborhood || 'Centro',
        address: data.address,
        serviceDate: data.serviceDate,
        dateLabel: data.dateLabel || 'Em breve',
        startTime: data.startTime || '08:00',
        endTime: data.endTime || '18:00',
        timeSlot: data.timeSlot || 'manha',
        urgency: data.urgency,
        status: 'open',
        images: data.images || [],
        photosCount: data.images?.length || 0,
        distanceKm: 2.5,
        createdAt: new Date().toISOString(),
      };

      setRequests((prev) => [newReq, ...prev]);
      setPublishModalOpen(false);

      // Notify compatible professionals
      const compatiblePros = professionals.filter(
        (p) =>
          p.categories.includes(data.categoryName) ||
          p.mainCategory === data.categoryName ||
          p.serviceAreas.includes(data.city)
      );

      compatiblePros.forEach((pro) => {
        const notif: NotificationItem = {
          id: `notif_${Date.now()}_${pro.id}`,
          userId: pro.userId,
          title: 'Nova oportunidade compatível perto de você!',
          message: `${data.title} em ${data.neighborhood}, ${data.city}. Mostre que você resolve!`,
          type: 'opportunity',
          read: false,
          requestId: newReq.id,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notif, ...prev]);
      });

      showToast(
        'Oportunidade publicada com sucesso! Notificando profissionais disponíveis.',
        'success'
      );
      setActiveView('contractor_dashboard');
    },
    [currentUser, professionals, showToast]
  );

  // Mark notification read
  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Register new user
  const registerUser = useCallback((newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    if (newUser.role === 'professional') {
      const newPro: ProfessionalProfile = {
        id: `pro_${Date.now()}`,
        userId: newUser.id,
        bio: 'Profissional capacitado pronto para atender com qualidade e pontualidade.',
        mainCategory: 'Manutenção Geral',
        categories: ['Manutenção e Instalações', 'Casa & Condomínio'],
        subcategories: ['Instalações', 'Reparos', 'Manutenção'],
        experienceYears: 5,
        rating: 5.0,
        totalReviews: 1,
        resolvedCount: 1,
        score: 100,
        completionRate: 100,
        isAvailableNow: true,
        serviceAreas: [newUser.city || 'Natal', 'Parnamirim'],
        inPersonService: true,
        remoteService: false,
        emergencyService: true,
        weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
        badges: [
          {
            id: 'badge_new',
            code: 'new',
            label: 'Novo Profissional',
            description: 'Profissional ativo e pronto para atender.',
            color: 'emerald',
          },
        ],
      };
      setProfessionals((prev) => [newPro, ...prev]);
      setActiveView('professional_dashboard');
    } else {
      setActiveView('contractor_dashboard');
    }
    showToast(`Bem-vindo ao EURESOLVO, ${newUser.name}!`, 'success');
  }, [showToast]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUserId ? { ...n, read: true } : n))
    );
    showToast('Todas as notificações foram marcadas como lidas.', 'info');
  }, [currentUserId, showToast]);

  return {
    users,
    professionals,
    requests,
    applications,
    reviews,
    notifications,
    currentUser,
    currentProProfile,
    favorites,
    activeView,
    selectedProId,
    selectedProfessionalId: selectedProId,
    selectedRequestId,
    publishModalOpen,
    authModalOpen,
    authMode,
    termsModalOpen,
    reviewModalData,
    toast,
    filters,
    unreadNotificationsCount,
    setActiveView,
    setSelectedProId,
    setSelectedProfessionalId: setSelectedProId,
    setSelectedRequestId,
    setPublishModalOpen,
    setAuthModalOpen,
    setAuthMode,
    setTermsModalOpen,
    setReviewModalData,
    setFilters,
    showToast,
    hideToast,
    switchUser,
    registerUser,
    applyToRequest,
    selectProfessional,
    selectProfessionalForRequest: selectProfessional,
    markRequestResolved,
    submitReview,
    addReview: submitReview,
    toggleAvailableNow,
    updateWeeklySchedule,
    toggleFavorite,
    publishRequest,
    publishServiceRequest: publishRequest,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
