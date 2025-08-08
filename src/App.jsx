// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalTimer from './components/GlobalTimer.jsx'; // 👈 ضيف الاستيراد فوق
import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import WheelPage from './pages/Wheel.jsx';
import Diary from './pages/Diary.jsx';
import Modules from './pages/Modules.jsx';
import ModuleDetail from './pages/ModuleDetail.jsx';
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
import CognitiveReappraisal from './pages/CognitiveReappraisal.jsx';
import Progress from './pages/Progress.jsx';
import Community from './pages/Community.jsx';
import BottomNav from './components/BottomNav.jsx';
import TestTheme from './pages/Test.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import About from './pages/About.jsx';
import ReferencesPage from './pages/Refrance.jsx';
import Login from './pages/Login.jsx';
export default function App() {

  return (
      <Router>
        <div className="flex flex-col min-h-screen">
          <GlobalTimer /> {/* 🕗️ دا التايمر التراكمي */}
          <Routes>
          <Route path="/" element={
          localStorage.getItem('username') ? <Navigate to="/home" /> : <Login/>
        } />  
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sources" element={<ReferencesPage />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/wheel" element={<WheelPage />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/modules/:id" element={<Modules />} />
            <Route path="/modules/thinking-errors" element={<ThinkingErrors />} />
            <Route path="/modules/defense-mechanisms" element={<DefenseMechanisms />} />
            <Route path="/modules/emotional-regulation" element={<EmotionalRegulation />} />
            <Route path="/modules/relationship-dynamics" element={<RelationshipDynamics />} />
            <Route path="/modules/self-compassion" element={<SelfCompassion />} />
            <Route path="/EmotionSelect" element={<EmotionSelect />} />
            <Route path="/EmotionCBT" element={<EmotionCBT />} />
            <Route path="/ToleranceWindow" element={<ToleranceWindow />} />
            <Route path="/SuppressionVsRegulation" element={<SuppressionVsRegulation />} />
            <Route path="/JournalingExercise" element={<JournalingExercise />} />
            <Route path="/Breathing478" element={<Breathing478 />} />
            <Route path="/DBTTipp" element={<DBTTipp />} />
            <Route path="/CognitiveReappraisal" element={<CognitiveReappraisal />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/community" element={<Community />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
      
    );
}
