import React, { useEffect, useState } from 'react';
import { useAppState, ActiveView } from './hooks/useAppState';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './views/HomeView';
import { FindProfessionalsView } from './views/FindProfessionalsView';
import { OpportunitiesWallView } from './views/OpportunitiesWallView';
import { ProfessionalProfileView } from './views/ProfessionalProfileView';
import { ProfessionalDashboardView } from './views/ProfessionalDashboardView';
import { ContractorDashboardView } from './views/ContractorDashboardView';
import { ForCompaniesView } from './views/ForCompaniesView';
import { AdminView } from './views/AdminView';

// Modals
import { PublishServiceModal } from './views/PublishServiceModal';
import { OpportunityDetailModal } from './views/OpportunityDetailModal';
import { AuthModal } from './views/AuthModal';
import { TermsAndPrivacyModal } from './views/TermsAndPrivacyModal';
import { ReviewModal } from './components/ReviewModal';
import { ReviewCriteria } from './types';

export default function App() {
  const {
    currentUser,
    users,
    professionals,
    requests,
    applications,
    reviews,
    favorites,
    activeView,
    selectedProfessionalId,
    selectedRequestId,
    filters,
    toast,
    unreadNotificationsCount,
    currentProProfile,
    setActiveView,
    setSelectedProfessionalId,
    setSelectedRequestId,
    setFilters,
    showToast,
    hideToast,
    switchUser,
    registerUser,
    loginUser,
    logoutUser,
    updateAvatar,
    isAuthenticated,
    toggleAvailableNow,
    updateWeeklySchedule,
    publishServiceRequest,
    applyToRequest,
    selectProfessionalForRequest,
    markRequestResolved,
    addReview,
    toggleFavorite,
  } = useAppState();

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPostAuthAction, setPendingPostAuthAction] = useState<
    | { type: 'publish' }
    | { type: 'apply'; requestId: string; message?: string }
    | null
  >(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'role_select'>('role_select');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  useEffect(() => {
    if (!isAuthenticated || !pendingPostAuthAction) return;

    if (pendingPostAuthAction.type === 'publish') {
      setIsPublishModalOpen(true);
      setPendingPostAuthAction(null);
      return;
    }

    if (pendingPostAuthAction.type === 'apply') {
      if (currentUser?.role !== 'professional') {
        showToast(
          'O EU RESOLVO é exclusivo para contas de profissionais.',
          'warning'
        );
        setPendingPostAuthAction(null);
        return;
      }

      if (!currentProProfile) return;

      applyToRequest(
        pendingPostAuthAction.requestId,
        pendingPostAuthAction.message
      );

      setPendingPostAuthAction(null);
    }
  }, [
    isAuthenticated,
    pendingPostAuthAction,
    currentUser,
    currentProProfile,
    applyToRequest,
    showToast,
  ]);

  const [reviewModalData, setReviewModalData] = useState<{
    requestId: string;
    proId: string;
    proName: string;
    serviceTitle: string;
  } | null>(null);

  // Quick navigation helpers
  const handleSelectPro = (proId: string) => {
    setSelectedProfessionalId(proId);
    setActiveView('professional_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
  };

  const handleApplyToRequest = (requestId: string, message?: string) => {
    if (!isAuthenticated) {
      setPendingPostAuthAction({
        type: 'apply',
        requestId,
        message,
      });
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser?.role !== 'professional') {
      showToast(
        'O EU RESOLVO é exclusivo para contas de profissionais.',
        'warning'
      );
      return;
    }

    applyToRequest(requestId, message);
  };

  const handleSelectProForRequest = (requestId: string, proId: string) => {
    selectProfessionalForRequest(requestId, proId);
  };

  const handleMarkResolved = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    markRequestResolved(requestId);

    // Open review modal if there was a selected professional
    if (req.selectedProfessionalId && req.selectedProfessionalName) {
      setReviewModalData({
        requestId: req.id,
        proId: req.selectedProfessionalId,
        proName: req.selectedProfessionalName,
        serviceTitle: req.title,
      });
    }
  };

  const handleReviewSubmit = (
    requestId: string,
    targetId: string,
    targetName: string,
    criteria: ReviewCriteria,
    comment: string
  ) => {
    addReview(requestId, targetId, targetName, criteria, comment);
    setReviewModalData(null);
  };

  // Selected entities
  const selectedPro = professionals.find((p) => p.id === selectedProfessionalId) || null;
  const selectedProUser = selectedPro
    ? users.find((u) => u.id === selectedPro.userId) || null
    : null;
  const activeSelectedRequest = requests.find((r) => r.id === selectedRequestId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#071B2F] selection:bg-[#071B2F] selection:text-white">
      {/* Offline Alert Bar */}
      <OfflineIndicator />

      {/* Header */}
      <Header
        currentUser={currentUser}
        users={users}
        activeView={activeView}
        unreadCount={unreadNotificationsCount}
        onNavigate={setActiveView}
        onOpenPublish={() => {
          if (isAuthenticated) {
            setIsPublishModalOpen(true);
            return;
          }

          setPendingPostAuthAction({ type: 'publish' });
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenAuth={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onSwitchUser={switchUser}
        isAuthenticated={isAuthenticated}
        onLogout={logoutUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeView === 'home' && (
          <HomeView
            currentUser={currentUser}
            professionals={professionals}
            users={users}
            requests={requests}
            applications={applications}
            favorites={favorites}
            filters={filters}
            onUpdateFilters={setFilters}
            onNavigate={setActiveView}
            onSelectPro={handleSelectPro}
            onSelectRequest={handleSelectRequest}
            onApplyToRequest={handleApplyToRequest}
            onToggleFavorite={toggleFavorite}
            onOpenPublish={() => setIsPublishModalOpen(true)}
          />
        )}

        {activeView === 'find_professionals' && (
          <FindProfessionalsView
            professionals={professionals}
            users={users}
            favorites={favorites}
            filters={filters}
            onUpdateFilters={setFilters}
            onSelectPro={handleSelectPro}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeView === 'opportunities_wall' && (
          <OpportunitiesWallView
            requests={requests}
            applications={applications}
            currentUser={currentUser}
            onApply={handleApplyToRequest}
            onSelectRequest={handleSelectRequest}
            onOpenPublish={() => setIsPublishModalOpen(true)}
          />
        )}

        {activeView === 'professional_profile' && (
          <ProfessionalProfileView
            professional={selectedPro}
            user={selectedProUser}
            reviews={reviews}
            isFavorite={selectedPro ? favorites.includes(selectedPro.id) : false}
            onBack={() => setActiveView('find_professionals')}
            onToggleFavorite={toggleFavorite}
            onRequestService={() => setIsPublishModalOpen(true)}
          />
        )}

        {activeView === 'dashboard' && currentUser.role === 'professional' && (
          <ProfessionalDashboardView
            currentUser={currentUser}
            profile={currentProProfile}
            requests={requests}
            applications={applications}
            onToggleAvailableNow={toggleAvailableNow}
            onSaveSchedule={updateWeeklySchedule}
            onApplyToRequest={handleApplyToRequest}
            onSelectRequest={handleSelectRequest}
            onNavigate={setActiveView}
            onUpdateAvatar={updateAvatar}
          />
        )}

        {(activeView === 'dashboard' || activeView === 'contractor_dashboard') && currentUser.role === 'contractor' && (
          <ContractorDashboardView
            currentUser={currentUser}
            requests={requests}
            applications={applications}
            professionals={professionals}
            onOpenPublish={() => setIsPublishModalOpen(true)}
            onSelectPro={handleSelectProForRequest}
            onMarkResolved={handleMarkResolved}
            onViewRequestDetails={handleSelectRequest}
          />
        )}

        {(activeView === 'schedule' || activeView === 'professional_dashboard') && (
          <ProfessionalDashboardView
            currentUser={currentUser}
            profile={currentProProfile}
            requests={requests}
            applications={applications}
            onToggleAvailableNow={toggleAvailableNow}
            onSaveSchedule={updateWeeklySchedule}
            onApplyToRequest={handleApplyToRequest}
            onSelectRequest={handleSelectRequest}
            onNavigate={setActiveView}
            onUpdateAvatar={updateAvatar}
          />
        )}

        {activeView === 'for_companies' && (
          <ForCompaniesView onOpenPublish={() => setIsPublishModalOpen(true)} />
        )}

        {activeView === 'admin' && (
          <AdminView
            users={users}
            professionals={professionals}
            requests={requests}
            reviews={reviews}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setActiveView}
        onOpenTerms={() => setIsTermsModalOpen(true)}
      />

      {/* Bottom Mobile Navigation */}
      <BottomNav
        activeView={activeView}
        currentUser={currentUser}
        onNavigate={setActiveView}
        onOpenPublish={() => setIsPublishModalOpen(true)}
      />

      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallPrompt />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={hideToast}
        />
      )}

      {/* MODALS */}
      {/* Publish Service / Demand Modal */}
      <PublishServiceModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={(data) => {
          publishServiceRequest(data);
          setIsPublishModalOpen(false);
          setActiveView('opportunities_wall');
        }}
      />

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        isOpen={!!selectedRequestId}
        request={activeSelectedRequest}
        applications={applications}
        currentUser={currentUser}
        onClose={() => setSelectedRequestId(null)}
        onApply={handleApplyToRequest}
        onSelectPro={handleSelectProForRequest}
        onMarkResolved={handleMarkResolved}
      />

      {/* Auth / Profile Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        users={users}
        currentUserId={currentUser.id}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={switchUser}
        onCreateUser={registerUser}
        onLoginUser={loginUser}
      />

      {/* Terms, LGPD & Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* 5-Criteria Review Modal */}
      {reviewModalData && (
        <ReviewModal
          data={reviewModalData}
          onClose={() => setReviewModalData(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
