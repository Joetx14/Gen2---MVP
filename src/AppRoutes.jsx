// src/AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Core Layout & Route Guards ---
import TopNav from './components/TopNav';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';
import NotFound from './NotFound'; // Your 404 component

// --- Lazy-loaded Page Components ---

// Public Landing & Info Pages
const MainLanding = lazy(() => import("./components/LandingPages/MainLanding"));
const AboutUs = lazy(() => import("./components/LandingPages/AboutUs"));
const ContactPage = lazy(() => import("./components/LandingPages/ContactPage"));
const Partnerships = lazy(() => import("./components/LandingPages/Partnerships"));
const Terms = lazy(() => import("./components/LandingPages/Terms"));
const Waitlist = lazy(() => import("./components/LandingPages/Waitlist"));
const ResourceLandingPage = lazy(() => import("./components/Resources/ResourceLandingPage"));
const ResourceDetailPage = lazy(() => import("./components/Resources/ArticleDetailPage"));
const Support = lazy(() => import("./components/LandingPages/Support"));

// Public-Only Auth & Onboarding Flow
const Login = lazy(() => import("./components/Auth/Login"));
const ForgotPassword = lazy(() => import("./components/Auth/ForgotPassword"));
const InviteCode = lazy(() => import("./components/LandingPages/InviteCode"));
const CreatePassword = lazy(() => import("./components/LandingPages/CreatePassword"));
const InviteAcceptance = lazy(() => import("./components/Collaborators/InviteAcceptance"));

// Protected Application Screens
const WelcomeScreen = lazy(() => import("./components/PlanningSteps/WelcomeScreen"));
const ChangePassword = lazy(() => import("./components/Auth/ChangePassword"));
const FarewellSettings = lazy(() => import("./components/Auth/FarewellSettings"));
const AddCollaborators = lazy(() => import("./components/Collaborators/AddCollaborators"));
const CollaboratorDashboard = lazy(() => import("./components/Collaborators/CollaboratorDashboard"));
const CollaboratorPlanView = lazy(() => import("./components/Collaborators/CollaboratorPlanView"));
const CollaboratorWelcome = lazy(() => import("./components/Collaborators/CollaboratorWelcome"));
const Donation = lazy(() => import("./components/Paywalls/Donation"));

// Protected Planning Steps
const BasicInformation = lazy(() => import("./components/PlanningSteps/BasicInformation"));
const FarewellCeremony = lazy(() => import("./components/PlanningSteps/FarewellCeremony"));
const FarewellCare = lazy(() => import("./components/PlanningSteps/FarewellCare"));
const FarewellCareCremation = lazy(() => import("./components/PlanningSteps/FarewellCareCremation"));
const FarewellCareBurial = lazy(() => import("./components/PlanningSteps/FarewellCareBurial"));
const CareAlternatives = lazy(() => import("./components/PlanningSteps/CareAlternatives"));
const RestingPlaceBurial = lazy(() => import("./components/PlanningSteps/RestingPlaceBurial"));
const RestingPlaceDonate = lazy(() => import("./components/PlanningSteps/RestingPlaceDonate"));
const RestingPlaceMemorial = lazy(() => import("./components/PlanningSteps/RestingPlaceMemorial"));
const RestingPlaceNature = lazy(() => import("./components/PlanningSteps/RestingPlaceNature"));
const RestingPlaceScattering = lazy(() => import("./components/PlanningSteps/RestingPlaceScattering"));
const TributesCeremony = lazy(() => import("./components/PlanningSteps/TributesCeremony"));
const TributesSpeaker = lazy(() => import("./components/PlanningSteps/TributesSpeaker"));
const TributesStory = lazy(() => import("./components/PlanningSteps/TributesStory"));
const ConfirmWishes = lazy(() => import("./components/PlanningSteps/ConfirmWishes"));

const AppRoutes = () => {
  const LoadingFallback = () => <div className="app-loading">Loading...</div>;

  return (
    <>
      <TopNav />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ======================================================= */}
          {/* Public-Only Routes (for logged-out users)           */}
          {/* ======================================================= */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/invite" element={<PublicRoute><InviteCode /></PublicRoute>} />
          <Route path="/create-password" element={<PublicRoute><CreatePassword /></PublicRoute>} />
          
          {/* ======================================================= */}
          {/* Fully Public Routes (for everyone)                    */}
          {/* ======================================================= */}
          <Route path="/" element={<MainLanding />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms/:tab" element={<Terms />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/support" element={<Support />} />
          <Route path="/resources" element={<ResourceLandingPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          {/* This must be public so new collaborators can click the email link */}
          <Route path="/accept-invite/:inviteId" element={<InviteAcceptance />} />

          {/* ======================================================= */}
          {/* Protected Application Routes (for logged-in users)    */}
          {/* ======================================================= */}
          <Route path="/welcome" element={<ProtectedRoute><WelcomeScreen /></ProtectedRoute>} />
          <Route path="/donation" element={<ProtectedRoute><Donation /></ProtectedRoute>} />
          
          {/* Account Management */}
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/account/settings" element={<ProtectedRoute><FarewellSettings /></ProtectedRoute>} />
          
          {/* Planning Flow */}
          <Route path="/basic-information" element={<ProtectedRoute><BasicInformation /></ProtectedRoute>} />
          <Route path="/farewell-ceremony" element={<ProtectedRoute><FarewellCeremony /></ProtectedRoute>} />
          <Route path="/farewell-care" element={<ProtectedRoute><FarewellCare /></ProtectedRoute>} />
          <Route path="/farewell-care-cremation" element={<ProtectedRoute><FarewellCareCremation /></ProtectedRoute>} />
          <Route path="/farewell-care-burial" element={<ProtectedRoute><FarewellCareBurial /></ProtectedRoute>} />
          <Route path="/care-alternatives" element={<ProtectedRoute><CareAlternatives /></ProtectedRoute>} />
          <Route path="/resting-place-burial" element={<ProtectedRoute><RestingPlaceBurial /></ProtectedRoute>} />
          <Route path="/resting-place-donate" element={<ProtectedRoute><RestingPlaceDonate /></ProtectedRoute>} />
          <Route path="/resting-place-memorial" element={<ProtectedRoute><RestingPlaceMemorial /></ProtectedRoute>} />
          <Route path="/resting-place-nature" element={<ProtectedRoute><RestingPlaceNature /></ProtectedRoute>} />
          <Route path="/resting-place-scattering" element={<ProtectedRoute><RestingPlaceScattering /></ProtectedRoute>} />
          <Route path="/tributes-ceremony" element={<ProtectedRoute><TributesCeremony /></ProtectedRoute>} />
          <Route path="/tributes-speaker" element={<ProtectedRoute><TributesSpeaker /></ProtectedRoute>} />
          <Route path="/tributes-story" element={<ProtectedRoute><TributesStory /></ProtectedRoute>} />
          <Route path="/confirm-wishes" element={<ProtectedRoute><ConfirmWishes /></ProtectedRoute>} />
          
          {/* Collaborator Flow */}
          <Route path="/share-wishes" element={<ProtectedRoute><AddCollaborators /></ProtectedRoute>} />
          <Route path="/collaborator/dashboard" element={<ProtectedRoute><CollaboratorDashboard /></ProtectedRoute>} />
          <Route path="/collaborator/plan-view" element={<ProtectedRoute><CollaboratorPlanView /></ProtectedRoute>} />
          <Route path="/collaborator/welcome" element={<ProtectedRoute><CollaboratorWelcome /></ProtectedRoute>} />

          {/* --- Redirects & Aliases for legacy or cleaner URLs --- */}
          <Route path="/farewell-settings" element={<Navigate to="/account/settings" replace />} />
          <Route path="/shared-wishes" element={<Navigate to="/collaborator/dashboard" replace />} />
          <Route path="/farewell-plans" element={<Navigate to="/confirm-wishes" replace />} />
          
          {/* --- Catch-All / 404 Route --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;