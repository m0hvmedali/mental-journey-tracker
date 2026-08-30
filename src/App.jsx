// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GlobalTimer from './components/GlobalTimer.jsx';
import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import WheelPage from './pages/Wheel.jsx';
import Diary from './pages/Diary.jsx';
import Modules from './pages/Modules.jsx';
import ModuleDetail from './pages/ModuleDetail.jsx';
import ModuleInternalPage from './pages/ModuleInternalPage.jsx';
import ThinkingErrors from './pages/ThinkingErrors.jsx';
import DefenseMechanisms from './pages/DefenseMechanisms.jsx';
import EmotionalRegulation from './pages/EmotionalRegulation.jsx';
import RelationshipDynamics from './pages/RelationshipDynamics.jsx';
import SelfCompassion from './pages/SelfCompassion.jsx';
import EmotionSelect from './pages/EmotionSelect.jsx';
import EmotionCBT from './pages/EmotionCBT.jsx';
import ToleranceWindow from './pages/ToleranceWindow.jsx';
import SuppressionVsRegulation from './pages/SuppressionVsRegulation.jsx';
import JournalingExercise from './pages/JournalingExercise.jsx';
import Breathing478 from './pages/Breathing478.jsx';
import DBTTipp from './pages/DBTTipp.jsx';
import ACTSkills from './pages/ACTSkills.jsx';
import SFBTSkills from './pages/SFBTSkills.jsx';
import PsychodynamicSkills from './pages/PsychodynamicSkills.jsx';
import CognitiveReappraisal from './pages/CognitiveReappraisal.jsx';
import Progress from './pages/Progress.jsx';
import Community from './pages/Community.jsx';
import DynamicContent from './pages/DynamicContent.jsx';
import AdminRouteGuard from './components/admin/AdminRouteGuard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ContentManager from './pages/admin/ContentManager.jsx';
import ContentEditor from './pages/admin/ContentEditor.jsx';
import MediaLibrary from './pages/admin/MediaLibrary.jsx';
import ReferencesManager from './pages/admin/ReferencesManager.jsx';
import TagsManager from './pages/admin/TagsManager.jsx';
import ModulesManager from './pages/admin/ModulesManager.jsx';
import ContentVersions from './pages/admin/ContentVersions.jsx';
import InsightsManager from './pages/admin/InsightsManager.jsx';
import BottomNav from './components/BottomNav.jsx';
import FloatingWellnessHub from './components/wellness/FloatingWellnessHub.jsx';
import InstagramOnboarding from './components/wellness/InstagramOnboarding.jsx';
import About from './pages/About.jsx';
import ReferencesPage from './pages/Refrance.jsx';
import Login from './pages/Login.jsx';
import LLMDebug from './pages/LLMDebug.jsx';
import { useState, useEffect } from 'react';
import { authService } from './services/authService.js';

function ProtectedRoute({ children, session }) {
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children, session }) {
  if (session) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function AppContent({ session }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const handleShow = () => setShowOnboarding(true);
    window.addEventListener('show-onboarding', handleShow);
    return () => window.removeEventListener('show-onboarding', handleShow);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <GlobalTimer />}
      <Routes>
        <Route path="/" element={<PublicOnlyRoute session={session}><Login /></PublicOnlyRoute>} /> 
        <Route path="/home" element={<ProtectedRoute session={session}><Home /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/sources" element={<ReferencesPage />} />
        <Route path="/setting" element={<ProtectedRoute session={session}><Settings /></ProtectedRoute>} />
        <Route path="/wheel" element={<ProtectedRoute session={session}><WheelPage /></ProtectedRoute>} />
        <Route path="/diary" element={<ProtectedRoute session={session}><Diary /></ProtectedRoute>} />
        <Route path="/modules" element={<ProtectedRoute session={session}><Modules /></ProtectedRoute>} />
        <Route path="/modules/:slug" element={<ProtectedRoute session={session}><ModuleDetail /></ProtectedRoute>} />
        <Route path="/modules/:moduleSlug/:pageSlug" element={<ProtectedRoute session={session}><ModuleInternalPage /></ProtectedRoute>} />
        <Route path="/modules/thinking-errors" element={<ProtectedRoute session={session}><ThinkingErrors /></ProtectedRoute>} />
        <Route path="/modules/defense-mechanisms" element={<ProtectedRoute session={session}><DefenseMechanisms /></ProtectedRoute>} />
        <Route path="/modules/emotional-regulation" element={<ProtectedRoute session={session}><EmotionalRegulation /></ProtectedRoute>} />
        <Route path="/modules/relationship-dynamics" element={<ProtectedRoute session={session}><RelationshipDynamics /></ProtectedRoute>} />
        <Route path="/modules/self-compassion" element={<ProtectedRoute session={session}><SelfCompassion /></ProtectedRoute>} />
        <Route path="/EmotionSelect" element={<ProtectedRoute session={session}><EmotionSelect /></ProtectedRoute>} />
        <Route path="/EmotionCBT" element={<ProtectedRoute session={session}><EmotionCBT /></ProtectedRoute>} />
        <Route path="/ToleranceWindow" element={<ProtectedRoute session={session}><ToleranceWindow /></ProtectedRoute>} />
        <Route path="/SuppressionVsRegulation" element={<ProtectedRoute session={session}><SuppressionVsRegulation /></ProtectedRoute>} />
        <Route path="/JournalingExercise" element={<ProtectedRoute session={session}><JournalingExercise /></ProtectedRoute>} />
        <Route path="/Breathing478" element={<ProtectedRoute session={session}><Breathing478 /></ProtectedRoute>} />
        <Route path="/DBTTipp" element={<ProtectedRoute session={session}><DBTTipp /></ProtectedRoute>} />
        <Route path="/ACTSkills" element={<ProtectedRoute session={session}><ACTSkills /></ProtectedRoute>} />
        <Route path="/SFBTSkills" element={<ProtectedRoute session={session}><SFBTSkills /></ProtectedRoute>} />
        <Route path="/PsychodynamicSkills" element={<ProtectedRoute session={session}><PsychodynamicSkills /></ProtectedRoute>} />
        <Route path="/CognitiveReappraisal" element={<ProtectedRoute session={session}><CognitiveReappraisal /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute session={session}><Progress /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute session={session}><Community /></ProtectedRoute>} />
        <Route path="/llm-debug" element={<ProtectedRoute session={session}><LLMDebug /></ProtectedRoute>} />
        
        {/* Dynamic CMS Content */}
        <Route path="/c/:slug" element={<ProtectedRoute session={session}><DynamicContent /></ProtectedRoute>} />
        
        {/* Admin Content Management Studio */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRouteGuard>
              <ContentManager />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/content/:slug"
          element={
            <AdminRouteGuard>
              <ContentEditor />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/media"
          element={
            <AdminRouteGuard>
              <MediaLibrary />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/references"
          element={
            <AdminRouteGuard>
              <ReferencesManager />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/tags"
          element={
            <AdminRouteGuard>
              <TagsManager />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/modules"
          element={
            <AdminRouteGuard>
              <ModulesManager />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/versions/:id"
          element={
            <AdminRouteGuard>
              <ContentVersions />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/insights"
          element={
            <AdminRouteGuard>
              <InsightsManager />
            </AdminRouteGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {session && !isAuthPage && !isAdminPage && (
        <>
          <FloatingWellnessHub />
          <BottomNav />
          <InstagramOnboarding forceShow={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </>
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getSession().then((session) => {
      setSession(session);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for auth changes
    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-app text-text-primary">جاري التحميل...</div>;
  }

  return (
    <Router>
      <AppContent session={session} />
    </Router>
  );
}
