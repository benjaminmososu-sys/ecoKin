import { useState } from 'react';
import { Map, Trash2, BookOpen, User, Bell, LogOut, CheckCircle2, Award, Calendar, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AuthView from './components/AuthView';
import MapView from './components/MapView';
import WasteView from './components/WasteView';
import LearnView from './components/LearnView';
import { initialReports } from './data';
import { Report } from './types';
import ImageWithLoader from './components/ImageWithLoader';

export default function App() {
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(() => {
    try {
      const name = localStorage.getItem('user_name');
      const email = localStorage.getItem('user_email');
      return name && email ? { name, email } : null;
    } catch (e) {
      return null;
    }
  });
  const [currentTab, setCurrentTab] = useState<'map' | 'waste' | 'learn' | 'account'>('map');
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [userPoints, setUserPoints] = useState<number>(1650);
  const [notifications, setNotifications] = useState<string[]>([
    'Bienvenue sur Eco-Kin City ! Commencez votre parcours citoyen.',
    'Anomalie résolue : Le couvercle de la poubelle de la Place du Marché a été réparé par l\'équipe technique !'
  ]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  // Active earned badges tracking
  const [earnedBadges, setEarnedBadges] = useState<string[]>([
    'Pionnier du Tri' // Initial default badge
  ]);

  const handleLoginSuccess = (user: { name: string; email: string }) => {
    setUserData(user);
    try {
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_email', user.email);
    } catch (e) {}
    // Push welcome notification
    setNotifications(prev => [
      `Heureux de vous revoir, ${user.name} ! Explorez la carte pour voir les signalements.`,
      ...prev
    ]);
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentTab('map');
    setUserPoints(1650);
    setEarnedBadges(['Pionnier du Tri']);
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('role');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
    } catch (e) {}
  };

  const handleEarnPoints = (amount: number) => {
    setUserPoints(prev => prev + amount);
    if (!earnedBadges.includes('Eco-Master Quiz Champion')) {
      setEarnedBadges(prev => [...prev, 'Eco-Master Quiz Champion']);
      setNotifications(prev => [
        '🎉 Nouveau Badge Débloqué : "Eco-Master Quiz Champion" pour votre participation !',
        ...prev
      ]);
    }
  };

  const handleAddReport = (newReportData: Omit<Report, 'id' | 'reportedBy' | 'reportedTime' | 'latPercent' | 'lngPercent'>) => {
    const newReport: Report = {
      ...newReportData,
      id: `report-${Date.now()}`,
      reportedBy: userData?.name || 'Moi-même',
      reportedTime: 'À l\'instant',
      // Random coordinates in safe central bounding boxes on the simulated map
      latPercent: Math.floor(Math.random() * 45) + 25,
      lngPercent: Math.floor(Math.random() * 50) + 20
    };

    setReports(prev => [newReport, ...prev]);
    setUserPoints(prev => prev + 30); // Award 30 points for filing reports!

    // Badge unlocked check
    if (!earnedBadges.includes('Dépisteur Agile')) {
      setEarnedBadges(prev => [...prev, 'Dépisteur Agile']);
      setNotifications(prev => [
        '🎉 Nouveau Badge Débloqué : "Dépisteur Agile" pour avoir envoyé votre premier signalement !',
        ...prev
      ]);
    }

    setNotifications(prev => [
      `Votre signalement "${newReport.title}" a bien été pris en compte ! (+30 Points)`,
      ...prev
    ]);
  };

  const handleUpdateReportStatus = (id: string, newStatus: 'En attente' | 'En cours' | 'Résolu') => {
    setReports(prev => prev.map(report => {
      if (report.id === id) {
        // Trigger notification if status updates
        setNotifications(curr => [
          `Le signalement "${report.title}" est désormais : "${newStatus}".`,
          ...curr
        ]);

        if (newStatus === 'Résolu' && !earnedBadges.includes('Citoyen Engagé')) {
          setEarnedBadges(badges => [...badges, 'Citoyen Engagé']);
          setNotifications(curr => [
            '🎉 Nouveau Badge Débloqué : "Citoyen Engagé" pour avoir aidé à la résolution d\'une anomalie !',
            ...curr
          ]);
        }

        return { ...report, status: newStatus };
      }
      return report;
    }));

    setUserPoints(prev => prev + 20); // Award 20 points for contributing!
  };

  // Auth check
  if (!userData) {
    return <AuthView onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans select-none overflow-x-hidden">
      {/* Persisted Top Navigation Bar */}
      <header className="bg-white/95 border-b border-slate-100 shadow-xs fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3.5 h-16">
        <div className="font-display text-lg font-bold text-primary flex items-center gap-2">
          <span className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center">
            🌱
          </span>
          <span className="tracking-tight">Eco-Kin City</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 relative transition-colors active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* Notifications Slide Down Overlay */}
      <AnimatePresence>
        {showNotificationsPanel && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setShowNotificationsPanel(false)} />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-4 right-4 md:left-auto md:right-4 z-50 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl max-w-sm w-full space-y-3"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-primary" />
                  Notifications
                </span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-2xs font-semibold text-slate-400 hover:text-primary transition-colors"
                >
                  Tout effacer
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-slate-50 custom-scrollbar text-2xs leading-relaxed text-slate-600">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="pt-2 flex gap-2">
                      <span className="text-primary shrink-0">🟢</span>
                      <p>{notif}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-4">Aucune notification.</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Primary Context Screen */}
      <main className="flex-1 pt-16 pb-24 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MapView
                reports={reports}
                onAddReport={handleAddReport}
                onUpdateReportStatus={handleUpdateReportStatus}
              />
            </motion.div>
          )}

          {currentTab === 'waste' && (
            <motion.div
              key="waste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WasteView onNavigateToReport={() => setCurrentTab('map')} />
            </motion.div>
          )}

          {currentTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LearnView userPoints={userPoints} onEarnPoints={handleEarnPoints} />
            </motion.div>
          )}

          {currentTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto p-4 space-y-6 text-xs leading-relaxed"
            >
              {/* Account profile */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-16 h-16 bg-primary text-white text-xl font-bold rounded-full flex items-center justify-center border-4 border-emerald-50 shadow-md">
                  {userData.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-sm sm:text-base font-extrabold text-slate-800">{userData.name}</h2>
                  <p className="text-slate-400 font-medium">{userData.email}</p>
                  <p className="text-2xs text-primary font-bold bg-emerald-50 border border-emerald-100 rounded-md px-2.5 py-0.5 inline-block">
                    Éco-Citoyen Niveau 3
                  </p>
                </div>
              </div>

              {/* Stats bento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-3xs">Points Accumulés</span>
                  <span className="text-lg font-extrabold text-primary font-mono">{userPoints} pts</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-3xs">Badges Débloqués</span>
                  <span className="text-lg font-extrabold text-secondary font-mono">{earnedBadges.length}</span>
                </div>
              </div>

              {/* Achievements collection */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <h3 className="font-display text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Vos Badges Civiques
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Pionnier du Tri', desc: 'Inscrit sur la plateforme et engagé pour l\'environnement.', icon: '🏆', unlocked: true },
                    { id: 'Dépisteur Agile', desc: 'Signalement d\'un déchet sauvage envoyé sur la carte.', icon: '🔍', unlocked: earnedBadges.includes('Dépisteur Agile') },
                    { id: 'Eco-Master Quiz Champion', desc: 'Réussite du Quiz quotidien sur le recyclage.', icon: '🎯', unlocked: earnedBadges.includes('Eco-Master Quiz Champion') },
                    { id: 'Citoyen Engagé', desc: 'Contribution effective à la résolution d\'une anomalie municipale.', icon: '🤝', unlocked: earnedBadges.includes('Citoyen Engagé') }
                  ].map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-xl border flex gap-3 items-center transition-all ${
                        badge.unlocked
                          ? 'bg-slate-50/50 border-slate-150'
                          : 'opacity-40 bg-slate-100/50 border-transparent select-none'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{badge.unlocked ? badge.icon : '🔒'}</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-700">{badge.id}</p>
                        <p className="text-slate-400 text-3xs leading-relaxed">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Log out */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 font-semibold py-3 px-4 rounded-xl shadow-inner transition-colors active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter de Eco-Kin City</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Bottom Sticky Tab Navigation */}
      <nav className="fixed bottom-0 w-full flex justify-around items-center px-4 pt-2.5 pb-safe bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-50 rounded-t-2xl">
        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'map'
              ? 'bg-primary-container text-white scale-102 font-bold px-5'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Map className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 tracking-wider uppercase font-semibold">Carte</span>
        </button>

        <button
          onClick={() => setCurrentTab('waste')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'waste'
              ? 'bg-primary-container text-white scale-102 font-bold px-5'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Trash2 className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 tracking-wider uppercase font-semibold">Déchets</span>
        </button>

        <button
          onClick={() => setCurrentTab('learn')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'learn'
              ? 'bg-primary-container text-white scale-102 font-bold px-5'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 tracking-wider uppercase font-semibold">Apprendre</span>
        </button>

        <button
          onClick={() => setCurrentTab('account')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all cursor-pointer rounded-xl ${
            currentTab === 'account'
              ? 'bg-primary-container text-white scale-102 font-bold px-5'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 tracking-wider uppercase font-semibold">Compte</span>
        </button>
      </nav>
    </div>
  );
}
