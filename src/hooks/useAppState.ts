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
import { supabase } from '../services/supabase';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Restore authenticated Supabase user when the app opens
  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    const restoreSupabaseSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error('Erro ao restaurar sessão:', sessionError);
        return;
      }

      const authUser = sessionData.session?.user;

      if (!authUser || cancelled) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return;
      }

      const { data: privateData, error: privateError } = await supabase
        .from('profile_private_data')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (privateError) {
        console.error('Erro ao carregar dados privados:', privateError);
      }

      if (cancelled) return;

      const restoredUser: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile.name,
        professionalName: profile.professional_name || undefined,
        role: profile.role as UserProfile['role'],
        phone: privateData?.phone || undefined,
        whatsapp: privateData?.whatsapp || undefined,
        whatsappNotifications:
          privateData?.whatsapp_notifications ?? false,
        avatarUrl: profile.avatar_url || undefined,
        city: profile.city || '',
        state: profile.state || 'RN',
        neighborhood: profile.neighborhood || undefined,
        cpf: privateData?.cpf || undefined,
        cnpj: privateData?.cnpj || undefined,
        contractorType:
          authUser.user_metadata?.contractor_type || undefined,
        organizationName:
          authUser.user_metadata?.organization_name || undefined,
        createdAt: profile.created_at,
      };

      setUsers((prev) => {
        const exists = prev.some((u) => u.id === restoredUser.id);

        if (exists) {
          return prev.map((u) =>
            u.id === restoredUser.id ? restoredUser : u
          );
        }

        return [restoredUser, ...prev];
      });

      setCurrentUserId(restoredUser.id);

      let restoredRequestsFromDb: ServiceRequest[] = [];

      const { data: savedRequests, error: requestsError } =
        await supabase
          .from("service_requests")
          .select("*")
          .order("created_at", { ascending: false });

      if (requestsError) {
        console.error("Erro ao carregar oportunidades:", requestsError);
      } else if (savedRequests && cancelled === false) {
        restoredRequestsFromDb = savedRequests.map((request) => ({
          id: request.id,
          contractorId: request.contractor_user_id,
          contractorName: request.contractor_name,
          contractorType:
            request.contractor_type as ServiceRequest["contractorType"],
          organizationName: request.organization_name || undefined,
          contractorAvatar: request.contractor_avatar || undefined,
          title: request.title,
          description: request.description,
          categoryId: request.category_id,
          categoryName: request.category_name,
          city: request.city,
          state: request.state,
          neighborhood: request.neighborhood,
          serviceDate: request.service_date,
          dateLabel: request.date_label || undefined,
          startTime: request.start_time,
          endTime: request.end_time,
          timeSlot: request.time_slot as ServiceRequest["timeSlot"],
          urgency: request.urgency as ServiceRequest["urgency"],
          status: request.status as ServiceRequest["status"],
          images: request.images || [],
          photosCount: request.photos_count || 0,
          distanceKm: 2.5,
          selectedProfessionalId:
            request.selected_professional_user_id || undefined,
          selectedProfessionalName:
            request.selected_professional_name || undefined,
          contactUnlocked: request.contact_unlocked,
          createdAt: request.created_at,
          resolvedAt: request.resolved_at || undefined,
        }));

        setRequests((previous) => {
          const databaseIds = new Set(
            restoredRequestsFromDb.map((request) => request.id)
          );

          return [
            ...restoredRequestsFromDb,
            ...previous.filter(
              (request) => databaseIds.has(request.id) === false
            ),
          ];
        });
      }

      if (restoredUser.role === "contractor") {
        const ownedRequestIds = restoredRequestsFromDb
          .filter((request) => request.contractorId === restoredUser.id)
          .map((request) => request.id);

        if (ownedRequestIds.length > 0) {
          const { data: receivedApplications, error: receivedApplicationsError } =
            await supabase
              .from("service_applications")
              .select(
                "id, request_id, professional_user_id, status, message, applied_at"
              )
              .in("request_id", ownedRequestIds)
              .order("applied_at", { ascending: false });

          if (receivedApplicationsError) {
            console.error(
              "Erro ao carregar interessados:",
              receivedApplicationsError
            );
          } else if (receivedApplications && cancelled === false) {
            const professionalUserIds = [
              ...new Set(
                receivedApplications.map(
                  (application) => application.professional_user_id
                )
              ),
            ];

            let applicantProfiles: any[] = [];

            if (professionalUserIds.length > 0) {
              const { data: publicProfiles, error: publicProfilesError } =
                await supabase
                  .from("profiles")
                  .select("id, name, professional_name, avatar_url")
                  .in("id", professionalUserIds);

              if (publicProfilesError) {
                console.error(
                  "Erro ao carregar perfis dos interessados:",
                  publicProfilesError
                );
              } else {
                applicantProfiles = publicProfiles || [];
              }
            }

            const restoredReceivedApplications: ServiceApplication[] =
              receivedApplications.map((application) => {
                const publicProfile = applicantProfiles.find(
                  (profile) =>
                    profile.id === application.professional_user_id
                );

                const localProfessional = professionals.find(
                  (professional) =>
                    professional.userId === application.professional_user_id
                );

                return {
                  id: application.id,
                  requestId: application.request_id,
                  professionalId:
                    localProfessional?.id ||
                    application.professional_user_id,
                  professionalName:
                    publicProfile?.professional_name ||
                    publicProfile?.name ||
                    "Profissional",
                  professionalAvatar:
                    publicProfile?.avatar_url || undefined,
                  professionalCategory:
                    localProfessional?.mainCategory || "Profissional",
                  rating: localProfessional?.rating || 0,
                  resolvedCount: localProfessional?.resolvedCount || 0,
                  completionRate:
                    localProfessional?.completionRate || 0,
                  status:
                    application.status as ServiceApplication["status"],
                  message: application.message || "",
                  appliedAt: application.applied_at,
                  isAvailableMatch:
                    localProfessional?.isAvailableNow || false,
                };
              });

            setApplications((previous) => {
              const restoredIds = new Set(
                restoredReceivedApplications.map(
                  (application) => application.id
                )
              );

              return [
                ...restoredReceivedApplications,
                ...previous.filter(
                  (application) =>
                    restoredIds.has(application.id) === false
                ),
              ];
            });
          }
        }
      }

      if (restoredUser.role === "professional") {
        const professionalProfile = professionals.find(
          (p) => p.userId === restoredUser.id
        );

        if (professionalProfile) {
          const { data: savedApplications, error: applicationsError } =
            await supabase
              .from("service_applications")
              .select("id, request_id, status, message, applied_at")
              .eq("professional_user_id", restoredUser.id)
              .order("applied_at", { ascending: false });

          if (applicationsError) {
            console.error("Erro ao carregar candidaturas:", applicationsError);
          } else if (savedApplications && cancelled === false) {
            const restoredApplications: ServiceApplication[] =
              savedApplications.map((application) => {
                const request = [
                  ...restoredRequestsFromDb,
                  ...requests,
                ].find(
                  (r) => r.id === application.request_id
                );

                return {
                  id: application.id,
                  requestId: application.request_id,
                  professionalId: professionalProfile.id,
                  professionalName:
                    restoredUser.professionalName || restoredUser.name,
                  professionalAvatar: restoredUser.avatarUrl,
                  professionalCategory: professionalProfile.mainCategory,
                  rating: professionalProfile.rating,
                  resolvedCount: professionalProfile.resolvedCount,
                  completionRate: professionalProfile.completionRate,
                  status:
                    application.status as ServiceApplication["status"],
                  message: application.message || "",
                  appliedAt: application.applied_at,
                  distanceKm: request?.distanceKm || 3.5,
                  isAvailableMatch: true,
                };
              });

            setApplications((previous) => {
              const restoredKeys = new Set(
                restoredApplications.map(
                  (a) => a.requestId + ":" + a.professionalId
                )
              );

              return [
                ...restoredApplications,
                ...previous.filter(
                  (a) =>
                    restoredKeys.has(
                      a.requestId + ":" + a.professionalId
                    ) === false
                ),
              ];
            });
          }
        }
      }
    };

    restoreSupabaseSession();

    return () => {
      cancelled = true;
    };
  }, []);

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
    async (requestId: string, message?: string) => {
      if (!currentProProfile || !currentUser) {
        setAuthMode('login');
        setAuthModalOpen(true);
        showToast('Entre como profissional para demonstrar interesse', 'warning');
        return;
      }

      if (!supabase) {
        showToast('Supabase não está configurado.', 'warning');
        return;
      }

      // Check if already applied locally
      const existing = applications.find(
        (a) => a.requestId === requestId && a.professionalId === currentProProfile.id
      );

      if (existing) {
        showToast('Você já demonstrou interesse nesta oportunidade!', 'info');
        return;
      }

      const req = requests.find((r) => r.id === requestId);
      if (!req) return;

      const applicationMessage =
        message ||
        `Olá! Eu resolvo. Estou disponível conforme os horários solicitados e tenho equipamentos completos para o atendimento.`;

      // Persist first in Supabase
      const { data: savedApplication, error } = await supabase
        .from('service_applications')
        .insert({
          request_id: requestId,
          professional_user_id: currentUser.id,
          status: 'interested',
          message: applicationMessage,
        })
        .select('id, request_id, status, message, applied_at')
        .single();

      if (error) {
        console.error('Erro ao enviar EU RESOLVO:', error);

        if (error.code === '23505') {
          showToast('Você já demonstrou interesse nesta oportunidade!', 'info');
          return;
        }

        showToast(
          'Não foi possível enviar seu interesse. Tente novamente.',
          'warning'
        );
        return;
      }

      const newApp: ServiceApplication = {
        id: savedApplication.id,
        requestId: savedApplication.request_id,
        professionalId: currentProProfile.id,
        professionalName: currentUser.professionalName || currentUser.name,
        professionalAvatar: currentUser.avatarUrl,
        professionalCategory: currentProProfile.mainCategory,
        rating: currentProProfile.rating,
        resolvedCount: currentProProfile.resolvedCount,
        completionRate: currentProProfile.completionRate,
        status: savedApplication.status as ServiceApplication['status'],
        message: savedApplication.message || applicationMessage,
        appliedAt: savedApplication.applied_at,
        distanceKm: req.distanceKm || 3.5,
        isAvailableMatch: true,
      };

      setApplications((prev) => [newApp, ...prev]);

      // Update request status locally for now
      if (req.status === 'open') {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: 'receiving_applications' }
              : r
          )
        );
      }

      // Contractor notification is still local for now
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

      showToast(
        'EU RESOLVO enviado com sucesso! O contratante foi notificado.',
        'success'
      );
    },
    [currentProProfile, currentUser, applications, requests, showToast]
  );

  // Contractor selects a professional
  const selectProfessional = useCallback(
    async (requestId: string, proId: string) => {
      if (!supabase) {
        showToast("Supabase não está configurado.", "warning");
        return;
      }

      const req = requests.find((r) => r.id === requestId);
      const application = applications.find(
        (a) => a.requestId === requestId && a.professionalId === proId
      );

      const pro = professionals.find(
        (p) => p.id === proId || p.userId === proId
      );

      const professionalUserId = pro?.userId || proId;

      if (!req || !application) {
        showToast(
          "Não foi possível localizar essa candidatura.",
          "warning"
        );
        return;
      }

      const selectedName =
        application.professionalName ||
        users.find((u) => u.id === professionalUserId)?.name ||
        "Profissional";

      const { error } = await supabase.rpc(
        "select_professional_for_request",
        {
          p_request_id: requestId,
          p_professional_user_id: professionalUserId,
        }
      );

      if (error) {
        console.error("Erro ao selecionar profissional:", error);
        showToast(
          "Não foi possível selecionar o profissional. Tente novamente.",
          "warning"
        );
        return;
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: "professional_selected",
                selectedProfessionalId: professionalUserId,
                selectedProfessionalName: selectedName,
                contactUnlocked: true,
              }
            : r
        )
      );

      setApplications((prev) =>
        prev.map((a) => {
          if (a.requestId !== requestId) return a;

          return a.professionalId === proId
            ? { ...a, status: "selected" }
            : { ...a, status: "rejected" };
        })
      );

      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: professionalUserId,
        title: "Você foi selecionado!",
        message: `Parabéns! Você foi o profissional escolhido para o serviço: "${req.title}". Dados de contato liberados.`,
        type: "selected",
        read: false,
        requestId,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [notif, ...prev]);

      showToast(
        "Profissional selecionado! Dados de contato liberados para agendamento.",
        "success"
      );
    },
    [professionals, users, requests, applications, showToast]
  );

  // Mark service as RESOLVED
  const markRequestResolved = useCallback(
    async (requestId: string) => {
      if (!supabase) {
        showToast("Supabase não está configurado.", "warning");
        return;
      }

      const req = requests.find((r) => r.id === requestId);

      if (!req) {
        showToast("Demanda não encontrada.", "warning");
        return;
      }

      if (req.contractorId !== currentUser.id) {
        showToast(
          "Somente o contratante desta demanda pode marcar como resolvido.",
          "warning"
        );
        return;
      }

      const resolvedAt = new Date().toISOString();

      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "resolved",
          resolved_at: resolvedAt,
          updated_at: resolvedAt,
        })
        .eq("id", requestId)
        .eq("contractor_user_id", currentUser.id);

      if (error) {
        console.error("Erro ao marcar serviço como resolvido:", error);
        showToast(
          "Não foi possível marcar o serviço como resolvido.",
          "warning"
        );
        return;
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: "resolved",
                resolvedAt,
              }
            : r
        )
      );

      if (req.selectedProfessionalId) {
        setProfessionals((prev) =>
          prev.map((p) => {
            if (
              p.id === req.selectedProfessionalId ||
              p.userId === req.selectedProfessionalId
            ) {
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

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#45C900", "#59E600", "#071B2F", "#003A67"],
        });
      } catch {
        // silent
      }

      showToast("Serviço marcado como RESOLVIDO ✓ Parabéns!", "success");

      if (req.selectedProfessionalId) {
        setReviewModalData({
          requestId: req.id,
          proId: req.selectedProfessionalId,
          proName: req.selectedProfessionalName || "Profissional",
          serviceTitle: req.title,
        });
      }
    },
    [requests, currentUser.id, showToast]
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
    async (data: {
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
      timeSlot?: "agora" | "manha" | "tarde" | "noite" | "personalizado";
      urgency: "low" | "normal" | "urgent" | "emergency";
      images?: string[];
    }) => {
      if (!supabase) {
        showToast("Supabase não está configurado.", "warning");
        return;
      }

      if (!currentUser || currentUser.role !== "contractor") {
        showToast("Entre como contratante para publicar um serviço.", "warning");
        return;
      }

      const images = data.images || [];

      const { data: savedRequest, error: requestError } = await supabase
        .from("service_requests")
        .insert({
          contractor_user_id: currentUser.id,
          contractor_name: currentUser.organizationName || currentUser.name,
          contractor_type: currentUser.contractorType || "individual",
          organization_name: currentUser.organizationName || null,
          contractor_avatar: currentUser.avatarUrl || null,
          title: data.title,
          description: data.description,
          category_id: data.categoryId,
          category_name: data.categoryName,
          city: data.city || "Natal",
          state: data.state || "RN",
          neighborhood: data.neighborhood || "Centro",
          service_date: data.serviceDate,
          date_label: data.dateLabel || "Em breve",
          start_time: data.startTime || "08:00",
          end_time: data.endTime || "18:00",
          time_slot: data.timeSlot || "manha",
          urgency: data.urgency,
          status: "open",
          images,
          photos_count: images.length,
        })
        .select("*")
        .single();

      if (requestError || !savedRequest) {
        console.error("Erro ao publicar oportunidade:", requestError);
        showToast(
          "Não foi possível publicar a oportunidade. Tente novamente.",
          "warning"
        );
        return;
      }

      if (data.address) {
        const { error: privateDataError } = await supabase
          .from("service_request_private_data")
          .insert({
            request_id: savedRequest.id,
            address: data.address,
          });

        if (privateDataError) {
          console.error(
            "Erro ao salvar endereço privado:",
            privateDataError
          );

          await supabase
            .from("service_requests")
            .delete()
            .eq("id", savedRequest.id);

          showToast(
            "Não foi possível concluir a publicação. Tente novamente.",
            "warning"
          );
          return;
        }
      }

      const newReq: ServiceRequest = {
        id: savedRequest.id,
        contractorId: savedRequest.contractor_user_id,
        contractorName: savedRequest.contractor_name,
        contractorType:
          savedRequest.contractor_type as ServiceRequest["contractorType"],
        organizationName: savedRequest.organization_name || undefined,
        contractorAvatar: savedRequest.contractor_avatar || undefined,
        title: savedRequest.title,
        description: savedRequest.description,
        categoryId: savedRequest.category_id,
        categoryName: savedRequest.category_name,
        city: savedRequest.city,
        state: savedRequest.state,
        neighborhood: savedRequest.neighborhood,
        address: data.address,
        serviceDate: savedRequest.service_date,
        dateLabel: savedRequest.date_label || undefined,
        startTime: savedRequest.start_time,
        endTime: savedRequest.end_time,
        timeSlot: savedRequest.time_slot as ServiceRequest["timeSlot"],
        urgency: savedRequest.urgency as ServiceRequest["urgency"],
        status: savedRequest.status as ServiceRequest["status"],
        images: savedRequest.images || [],
        photosCount: savedRequest.photos_count || 0,
        distanceKm: 2.5,
        selectedProfessionalId:
          savedRequest.selected_professional_user_id || undefined,
        selectedProfessionalName:
          savedRequest.selected_professional_name || undefined,
        contactUnlocked: savedRequest.contact_unlocked,
        createdAt: savedRequest.created_at,
        resolvedAt: savedRequest.resolved_at || undefined,
      };

      setRequests((prev) => [newReq, ...prev]);
      setPublishModalOpen(false);

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
          title: "Nova oportunidade compatível perto de você!",
          message: `${data.title} em ${data.neighborhood}, ${data.city}. Mostre que você resolve!`,
          type: "opportunity",
          read: false,
          requestId: newReq.id,
          createdAt: new Date().toISOString(),
        };

        setNotifications((prev) => [notif, ...prev]);
      });

      showToast(
        "Oportunidade publicada com sucesso! Notificando profissionais disponíveis.",
        "success"
      );

      setActiveView("contractor_dashboard");
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
  const registerUser = useCallback(
    async (newUser: UserProfile, password: string): Promise<boolean> => {
      if (!supabase) {
        showToast('Supabase não está configurado.', 'error');
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            professional_name:
              newUser.role === 'professional' ? newUser.name : null,
            phone: newUser.phone,
            whatsapp: newUser.whatsapp,
            city: newUser.city,
            state: newUser.state,
            contractor_type: newUser.contractorType,
            organization_name: newUser.organizationName,
          },
        },
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        showToast(error.message || 'Não foi possível criar a conta.', 'error');
        return false;
      }

      if (!data.user) {
        showToast('Não foi possível criar a conta.', 'error');
        return false;
      }

      const createdUser: UserProfile = {
        ...newUser,
        id: data.user.id,
      };

      setUsers((prev) => [createdUser, ...prev]);

      if (data.session) {
        setCurrentUserId(data.user.id);
        setIsAuthenticated(true);

        if (createdUser.role === 'professional') {
          const newPro: ProfessionalProfile = {
            id: `pro_${data.user.id}`,
            userId: data.user.id,
            bio: 'Profissional capacitado pronto para atender com qualidade e pontualidade.',
            mainCategory: 'Manutenção Geral',
            categories: ['Manutenção e Instalações', 'Casa & Condomínio'],
            subcategories: ['Instalações', 'Reparos', 'Manutenção'],
            experienceYears: 5,
            rating: 0,
            totalReviews: 0,
            resolvedCount: 0,
            score: 0,
            completionRate: 100,
            isAvailableNow: true,
            serviceAreas: [createdUser.city || 'Natal'],
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

        showToast(`Bem-vindo ao EURESOLVO, ${createdUser.name}!`, 'success');
      } else {
        showToast(
          'Conta criada. Confira seu e-mail para confirmar o cadastro.',
          'success'
        );
      }

      return true;
    },
    [showToast]
  );

  // Login with Supabase
  const loginUser = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (!supabase) {
        showToast('Supabase não está configurado.', 'error');
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error('Erro no login:', error);
        showToast(
          error?.message || 'E-mail ou senha inválidos.',
          'error'
        );
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Erro ao carregar perfil:', profileError);
        showToast('Não foi possível carregar seu perfil.', 'error');
        return false;
      }

      const { data: privateData, error: privateError } = await supabase
        .from('profile_private_data')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (privateError) {
        console.error('Erro ao carregar dados privados:', privateError);
      }

      const loggedUser: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile.name,
        professionalName: profile.professional_name || undefined,
        role: profile.role as UserProfile['role'],
        phone: privateData?.phone || undefined,
        whatsapp: privateData?.whatsapp || undefined,
        whatsappNotifications:
          privateData?.whatsapp_notifications ?? false,
        avatarUrl: profile.avatar_url || undefined,
        city: profile.city || '',
        state: profile.state || 'RN',
        neighborhood: profile.neighborhood || undefined,
        cpf: privateData?.cpf || undefined,
        cnpj: privateData?.cnpj || undefined,
        contractorType:
          data.user.user_metadata?.contractor_type || undefined,
        organizationName:
          data.user.user_metadata?.organization_name || undefined,
        createdAt: profile.created_at,
      };

      setUsers((prev) => {
        const exists = prev.some((u) => u.id === loggedUser.id);

        if (exists) {
          return prev.map((u) =>
            u.id === loggedUser.id ? loggedUser : u
          );
        }

        return [loggedUser, ...prev];
      });

      setCurrentUserId(loggedUser.id);
      setIsAuthenticated(true);

      if (loggedUser.role === 'professional') {
        setProfessionals((prev) => {
          const exists = prev.some((p) => p.userId === loggedUser.id);

          if (exists) return prev;

          const newPro: ProfessionalProfile = {
            id: `pro_${loggedUser.id}`,
            userId: loggedUser.id,
            bio: 'Profissional capacitado pronto para atender com qualidade e pontualidade.',
            mainCategory: 'Manutenção Geral',
            categories: ['Manutenção e Instalações', 'Casa & Condomínio'],
            subcategories: ['Instalações', 'Reparos', 'Manutenção'],
            experienceYears: 0,
            rating: 0,
            totalReviews: 0,
            resolvedCount: 0,
            score: 0,
            completionRate: 100,
            isAvailableNow: true,
            serviceAreas: [loggedUser.city || 'Natal'],
            inPersonService: true,
            remoteService: false,
            emergencyService: false,
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

          return [newPro, ...prev];
        });

        setActiveView('professional_dashboard');
      } else if (loggedUser.role === 'admin') {
        setActiveView('admin');
      } else {
        setActiveView('contractor_dashboard');
      }

      showToast(`Bem-vindo de volta, ${loggedUser.name}!`, 'success');
      return true;
    },
    [showToast]
  );

  const logoutUser = useCallback(async (): Promise<boolean> => {
    if (!supabase) {
      showToast('Supabase não está configurado.', 'warning');
      return false;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao sair:', error);
      showToast('Não foi possível sair da conta.', 'warning');
      return false;
    }

    setIsAuthenticated(false);
    setCurrentUserId('');
    setActiveView('home');

    showToast('Você saiu da sua conta.', 'info');
    return true;
  }, [showToast]);

  const updateAvatar = useCallback(
    async (file: File): Promise<boolean> => {
      if (supabase === null || !currentUserId) {
        showToast('Não foi possível atualizar a foto.', 'warning');
        return false;
      }

      if (!file.type.startsWith('image/')) {
        showToast('Selecione uma imagem válida.', 'warning');
        return false;
      }

      try {
        const avatarUrl = await new Promise<string>((resolve, reject) => {
          const image = new Image();
          const objectUrl = URL.createObjectURL(file);

          image.onload = () => {
            try {
              const maxSize = 800;
              const scale = Math.min(
                1,
                maxSize / Math.max(image.width, image.height)
              );

              const width = Math.max(1, Math.round(image.width * scale));
              const height = Math.max(1, Math.round(image.height * scale));

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');

              if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Canvas indisponível'));
                return;
              }

              ctx.drawImage(image, 0, 0, width, height);

              const compressed = canvas.toDataURL('image/jpeg', 0.82);

              URL.revokeObjectURL(objectUrl);
              resolve(compressed);
            } catch (error) {
              URL.revokeObjectURL(objectUrl);
              reject(error);
            }
          };

          image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Formato de imagem não suportado'));
          };

          image.src = objectUrl;
        });

        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', currentUserId);

        if (error) {
          console.error('Erro ao atualizar avatar:', error);
          showToast('Não foi possível salvar a foto.', 'warning');
          return false;
        }

        setUsers((prev) =>
          prev.map((user) =>
            user.id === currentUserId ? { ...user, avatarUrl } : user
          )
        );

        showToast('Foto de perfil atualizada.', 'success');
        return true;
      } catch (error) {
        console.error('Erro ao processar avatar:', error);
        showToast(
          'Não foi possível processar esta foto. Tente outra imagem.',
          'warning'
        );
        return false;
      }
    },
    [currentUserId, showToast]
  );

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
    isAuthenticated,
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
    loginUser,
    logoutUser,
    updateAvatar,
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
