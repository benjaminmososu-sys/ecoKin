import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Leaf, CheckCircle, Github, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ImageWithLoader from './ImageWithLoader';
import { apiRequest } from '../services/api';

interface AuthViewProps {
  onSuccess: (userData: { name: string; email: string }) => void;
}

export default function AuthView({ onSuccess }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
      return;
    }

    if (activeTab === 'signup' && !name) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }

    setIsLoading(true);

    if (activeTab === 'login') {
      apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        setIsLoading(false);
        if (res.ok) {
          const payload = res.data as any;
          try {
            localStorage.setItem('access_token', payload.access_token);
            localStorage.setItem('token_type', payload.token_type ?? 'bearer');
            localStorage.setItem('role', payload.role ?? 'citizen');
            localStorage.setItem('user_name', (name || email.split('@')[0]));
            localStorage.setItem('user_email', email);
          } catch (e) {
            // ignore storage errors
          }

          onSuccess({ name: name || email.split('@')[0], email });
        } else {
          const detail = (res.data as { detail?: string }).detail;
          setErrorMsg(detail ?? 'Échec de connexion, vérifiez vos identifiants.');
        }
      });
    } else {
      apiRequest('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password, role: 'citizen' }),
      }).then((res) => {
        setIsLoading(false);
        if (res.ok) {
          // After successful register, store basic user info locally (no token provided by register)
          try {
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_email', email);
          } catch (e) {}

          onSuccess({ name, email });
        } else {
          const detail = (res.data as { detail?: string }).detail;
          setErrorMsg(detail ?? 'Échec de l’inscription.');
        }
      });
    }
  };

  const handleQuickLogin = (role: 'admin' | 'citizen') => {
    setName(role === 'admin' ? 'Coordinateur Eco-Kin City' : 'Éco Citoyen #142');
    setEmail(role === 'admin' ? 'admin@ecokincity.fr' : 'citoyen@ecokincity.fr');
    setPassword('demopassword');
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-on-surface font-sans overflow-hidden">
      {/* Left Branding Panel (Visible on md+) */}
      <div className="hidden md:flex flex-1 relative items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithLoader
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChuUydC_9h9Gg8VnoZYc8154qqfoRQcl3IiDzX2-wVHCRyMloMmKteo4CKUUprJfc1KoazYgJzo0XsPm2YXhFIM6ogVxmdpmdJD9BHx07mgdZg_FUBC04--sWalzJDz36pikWdIuI6eID4iCLzqJAKq1rVnowpa8mx9ERv3HSkdp9gsFfFVHaivq95CrXRR8Y60Gsw5hAJkDCFAiEP-ZJ1sI1e9JFMFXYU8vLXNZDcUyAfNO5UaxA"
            alt="Sustainable future city concept"
            className="w-full h-full opacity-40 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-primary via-primary/60 to-transparent" />
        </div>

        <div className="relative z-10 p-12 max-w-lg text-white space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md">
              <Leaf className="w-8 h-8 text-primary-container" />
            </span>
            <h1 className="font-display font-bold text-3xl tracking-tight">Eco-Kin City</h1>
          </div>
          <h2 className="font-display text-2xl font-semibold leading-normal opacity-95">
            Construisons ensemble une communauté plus propre et plus verte. Signalements en temps réel, actions collectives.
          </h2>
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
              <span className="text-sm font-medium">Signalements fiables et suivis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
              <span className="text-sm font-medium">Récompenses en points civiques éco-citoyens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
              <span className="text-sm font-medium">Quiz ludiques et fiches pratiques pédagogiques</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Interaction Panel (Form) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        {/* Mobile Header (Visible on Mobile) */}
        <div className="md:hidden flex items-center gap-2 text-primary mb-8 animate-fade-in">
          <Leaf className="w-8 h-8 text-primary" />
          <span className="font-display text-2xl font-extrabold tracking-tight">Eco-Kin City</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-xs relative z-10"
        >
          {/* Auth Tab Toggles */}
          <div className="flex border-b border-outline-variant/30 mb-6">
            <button
              id="loginToggle"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-all text-center relative ${
                activeTab === 'login' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Se Connecter
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              id="signupToggle"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 pb-3 text-sm font-semibold transition-all text-center relative ${
                activeTab === 'signup' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Créer un Compte
              {activeTab === 'signup' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>

          {/* Welcome Text */}
          <div className="space-y-1 mb-6">
            <h2 className="font-display text-xl font-bold text-slate-800">
              {activeTab === 'login' ? 'Bon retour parmi nous' : 'Rejoignez le Mouvement'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'login'
                ? 'Saisissez vos identifiants pour accéder à votre tableau de bord.'
                : 'Commencez à signaler des anomalies et accumulez des points civiques.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            <AnimatePresence mode="popLayout">
              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase ml-1">
                    Nom Complet
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <User className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean Dupont"
                      type="text"
                      className="bg-transparent border-none focus:outline-hidden w-full text-sm text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase ml-1">
                Adresse Email
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Mail className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  type="email"
                  className="bg-transparent border-none focus:outline-hidden w-full text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Mot de Passe
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Fonctionnalité de démonstration : votre mot de passe est "demopassword"')}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Lock className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  className="bg-transparent border-none focus:outline-hidden w-full text-sm text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-container hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-xs active:scale-98 transition-all mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Accéder au Tableau de Bord' : 'Créer un Compte'}</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-[1.5px] flex-1 bg-slate-100" />
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">OU CONTINUER AVEC</span>
            <div className="h-[1.5px] flex-1 bg-slate-100" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleQuickLogin('citizen')}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-700 transition-all active:scale-95"
            >
              <User className="w-4 h-4 text-emerald-600" />
              Mode Citoyen
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-700 transition-all active:scale-95"
            >
              <User className="w-4 h-4 text-blue-600" />
              Mode Admin
            </button>
          </div>

          {/* Footer Terms */}
          <p className="text-center text-[10px] text-slate-400 leading-normal">
            En continuant, vous acceptez nos{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Politique de confidentialité
            </a>.
          </p>
        </motion.div>

        {/* Ambient Blur circles behind */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 -right-20 w-56 h-56 bg-secondary/5 rounded-full blur-3xl -z-10" />
      </main>
    </div>
  );
}
