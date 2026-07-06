import { useState, useMemo, FormEvent } from 'react';
import { Search, Info, Calendar, ChevronRight, AlertTriangle, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { recyclingGuideItems } from '../data';
import ImageWithLoader from './ImageWithLoader';

interface WasteViewProps {
  onNavigateToReport: () => void;
}

const TIPS = [
  {
    title: 'Achats sans emballage',
    desc: 'Apportez vos propres bocaux en verre dans les épiceries en vrac pour réduire les emballages en plastique jetables.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlmdIy2pmvxTMBnzrFSTi1zok2nXN2lyTIOFJT-arP-_4a-PR87X3UmAoZPfsUbgZJ6R-ZkvO52Ixw18KYgl-5p-puYG9kzaXYDTeFiDOeAiD9n5nmggs400bvyPFhb7ZEiQY02G-4WgGESuQXevQ28dar2LpkqbGjo9W3g4d0oIbgG2lqH0DVz0CwuNo4Ve5sW-jTmmhXSYOjMQFy5-Y4LdCWcC2ar9ODAG2W6ZSrLbjbf1-8vPI'
  },
  {
    title: 'Compostage domestique',
    desc: 'Transformez vos épluchures et coquilles d\'œufs en engrais naturel pour nourrir vos plantes vertes et jardinières.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDudErJotxmtDd5z9qafJGT9cVvhSI2gPE6GW2mdvomQZm_T7Z3VtPqMajJNbDQcspB7I69sxdlzA_PrtsRhCT3g8j-ujBKsWLqORJZ4619Q90KO9QKM62ZX9a9oo0On-ODILo-eUMxbnvtGxVOARZUcGnFKTj1v4FoolDU3eBu6Euk1TxHQNT9_TX10hZsFIIs8vYuFhTuzXovpZNGmHnieKQQLXbmcQUCzU_byszlMA49Fxy40iQ'
  },
  {
    title: 'Adieu bouteilles plastiques',
    desc: 'Emportez partout votre gourde isotherme en inox pour éviter d\'acheter de l\'eau en bouteilles plastiques polluantes.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqAioVK6uNjbbPoRHM34C7k2EbGOhYx_7e2oW2HhSh90eDSzHyR-CRSKzmsusQKNuhDXhzlpKi8TCaDqu6P4YP5yE1amqyON4VKlGTX937hxOSgmPpgIwYuPqEeg1nLFRoz6-SeFyNmoIuIM9750jwCVk6Iqoe3uJv0C2ztMLeKzc7xDllXBvkdw3JjwZJLV9P6xeKqtycxfJRp3UznGbrrYsVpCssFN0yPedD_cjkgUfuYkl7HrM'
  }
];

export default function WasteView({ onNavigateToReport }: WasteViewProps) {
  const [guideQuery, setGuideQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredGuideItems = useMemo(() => {
    if (!guideQuery.trim()) return [];
    return recyclingGuideItems.filter(item =>
      item.name.toLowerCase().includes(guideQuery.toLowerCase())
    );
  }, [guideQuery]);

  const handleGuideSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSearchResults(true);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Organic': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Plastic': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Paper': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Electronic': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Hazardous': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Organic': return '🌱 Compost / Bio';
      case 'Plastic': return '♻️ Bac Jaune (Recyclable)';
      case 'Paper': return '📦 Bac Jaune (Carton/Papier)';
      case 'Electronic': return '🔌 Électronique / DEEE';
      case 'Hazardous': return '⚠️ Déchetterie (Piles/Chimique)';
      default: return '🗑️ Tout-venant / Ordures';
    }
  };

  return (
    <div className="pb-24 px-4 pt-4 max-w-5xl mx-auto space-y-8 font-sans">
      {/* Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl p-6 bg-primary text-white shadow-lg">
        <div className="relative z-10 space-y-1.5 max-w-md">
          <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
            Gestion des Déchets
          </h1>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Consultez le calendrier de ramassage de votre rue et triez intelligemment pour préserver l'environnement urbain.
          </p>
        </div>
        {/* Abstract shapes inside banner */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </section>

      {/* Recycling Search Engine "What goes where?" */}
      <section className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <h2 className="font-display text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-primary" />
          Guide du Tri Intelligent
        </h2>
        <form onSubmit={handleGuideSearchSubmit} className="relative">
          <input
            type="text"
            value={guideQuery}
            onChange={(e) => {
              setGuideQuery(e.target.value);
              setShowSearchResults(true);
            }}
            placeholder="Que voulez-vous jeter ? (ex: boîte de pizza, piles, bouteille...)"
            className="w-full pl-4 pr-24 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-2 bottom-2 px-5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Rechercher
          </button>
        </form>

        {/* Live Search Results */}
        <AnimatePresence>
          {showSearchResults && guideQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-slate-100 rounded-xl mt-2 divide-y divide-slate-50 bg-slate-50/50"
            >
              {filteredGuideItems.length > 0 ? (
                filteredGuideItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-slate-500 italic leading-relaxed text-2xs">"{item.instructions}"</p>
                    </div>
                    <span className={`self-start sm:self-center px-2.5 py-1 rounded-full border text-2xs font-bold whitespace-nowrap uppercase tracking-wider ${getCategoryBadgeColor(item.category)}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  Aucun résultat trouvé pour "{guideQuery}". Essayez avec d'autres mots clés.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Weekly Schedule Calendar */}
      <section className="space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="font-display text-sm font-bold text-slate-800">Calendrier Hebdomadaire</h2>
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            Juillet 2026
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {[
            { day: 'LUN', date: 20, active: false, label: '' },
            { day: 'MAR', date: 21, active: true, label: '🌱 Organique', color: 'bg-primary-container text-white' },
            { day: 'MER', date: 22, active: false, label: '' },
            { day: 'JEU', date: 23, active: false, label: '' },
            { day: 'VEN', date: 24, active: true, label: '♻️ Tri Jaune', color: 'bg-secondary text-white shadow-xs' },
            { day: 'SAM', date: 25, active: false, label: '' },
            { day: 'DIM', date: 26, active: false, label: '' }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${
                item.active
                  ? `${item.color} border-transparent ring-3 ring-emerald-500/10 transform scale-102 font-semibold shadow-xs`
                  : 'bg-white border-slate-100 text-slate-700'
              }`}
            >
              <span className={`text-[10px] tracking-wider font-bold ${item.active ? 'text-white/85' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className="font-display text-sm font-bold">{item.date}</span>
              {item.active && (
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-0.5 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Waste Type Bento Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Organic card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-105" />
          <div className="relative z-10 flex flex-col h-full gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700">
                🌱
              </span>
              <h3 className="font-display text-sm font-bold text-slate-800">Organique</h3>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-2xs uppercase font-bold tracking-wider">Prochain Passage :</p>
              <p className="font-display text-base font-extrabold text-primary">Mardi, 8:00</p>
            </div>
            <div className="mt-auto pt-2 flex items-center justify-between text-2xs text-slate-400">
              <span>Biodéchets, restes alimentaires</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* Plastics/Recycling Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-105" />
          <div className="relative z-10 flex flex-col h-full gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-700">
                ♻️
              </span>
              <h3 className="font-display text-sm font-bold text-slate-800">Plastique</h3>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-2xs uppercase font-bold tracking-wider">Prochain Passage :</p>
              <p className="font-display text-base font-extrabold text-secondary">Vendredi, 8:00</p>
            </div>
            <div className="mt-auto pt-2 flex items-center justify-between text-2xs text-slate-400">
              <span>Flacons, canettes, bouteilles</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary transition-colors" />
            </div>
          </div>
        </div>

        {/* Paper/Cardboard Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-105" />
          <div className="relative z-10 flex flex-col h-full gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                📦
              </span>
              <h3 className="font-display text-sm font-bold text-slate-800">Papier / Carton</h3>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-2xs uppercase font-bold tracking-wider">Prochain Passage :</p>
              <p className="font-display text-base font-extrabold text-amber-700">26 Juil, 8:00</p>
            </div>
            <div className="mt-auto pt-2 flex items-center justify-between text-2xs text-slate-400">
              <span>Cartons bruts, journaux, enveloppes</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Tips Carousel */}
      <section className="space-y-3">
        <h2 className="font-display text-sm font-bold text-slate-800">Conseils d'Éco-Geste</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="min-w-[280px] md:min-w-[320px] snap-center p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4 items-start relative overflow-hidden shadow-xs hover:border-emerald-200 transition-colors"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                <ImageWithLoader
                  src={tip.img}
                  alt={tip.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {tip.title}
                </h4>
                <p className="text-slate-500 text-2xs leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Missed Collection Banner */}
      <section className="bg-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200/50">
        <div className="space-y-1.5 text-center sm:text-left text-xs">
          <h2 className="font-display text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Une collecte de ramassage oubliée ?
          </h2>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Signalez immédiatement des poubelles de ramassage oubliées ou débordantes sur la carte interactive pour alerter notre brigade de propreté urbaine.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToReport}
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all text-xs active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <span>Signaler une anomalie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative flex items-center justify-center bg-white/60 border border-slate-200 rounded-full shadow-inner animate-pulse">
          <span className="text-4xl">🚯</span>
        </div>
      </section>
    </div>
  );
}
