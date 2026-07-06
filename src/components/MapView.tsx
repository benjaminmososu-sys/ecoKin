import { useState, useEffect, useRef, FormEvent } from 'react';
import { Search, Navigation, Plus, X, MapPin, CheckCircle, Clock, AlertTriangle, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Report } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { apiRequest } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Ensure Leaflet's default icon URLs are correct with Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl: iconShadowUrl,
});

interface MapViewProps {
  reports: Report[];
  onAddReport: (newReport: Omit<Report, 'id' | 'reportedBy' | 'reportedTime' | 'latPercent' | 'lngPercent'>) => void;
  onUpdateReportStatus: (id: string, newStatus: 'En attente' | 'En cours' | 'Résolu') => void;
}

// Sample mock images for reporting to choose from
const MOCK_REPORT_IMAGES = [
  { name: 'Composteur', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB67dhfrAdlm5JqTDUKP5CO4RLswc9g1ETU-suHvalL0Aq9_VD3zOLH2qQYi_bo7HCuPmlhlmEkTa0FNsDchvxUnBcmxRgji0evmnWJJ22KTnavd9r7f1-ebllLJiLuVBtr5gUz3xen_SvPxjRADam8zHXY6KWWNBxgx55HyauM0F12zWf_nTkuiZxMYTcuQMNRWwJaPetQOJSaD907wmfN8tEkfQkCEG-BOSZvZczaJrr2LPH-mCI' },
  { name: 'Décharge sauvage plastique', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJde4en4BoNGD43btPgd52VqxEKHauMb9fSqAbp3-G4k1pyBqKfMkjyu-1nu82cYsoTIVY3czgXROM4HGgZJloPiYUen1dZvyExovuMsYQ9LuCRQgpjE24S614rvBHMn_PkgaEJ6I6xcLnZCjdQNFTZuJ1dwdN-esg5zxS0-JXxjNs9q5TG1ZkO0N-uGvsue-TGnlkistNzFXWIWFyriXI-AScnsoxTREuv4JSoOcsEoe7oDLvA0' },
  { name: 'Poubelle encombrée', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzowMbkVD4DSXdzTllVrXq0wuD761AFdy6V3fvV_p22lwGwXIefJoMGq2Ey1vlLhPQC3wQfnZcHCYfRPTfzbez9oX7K3iNk0_NfiDKsEQp5t9R-tJU5SnGsgWUHHtbEn5hVO0rJMyxwa2IhZ4KW8LPVNOyUMo4smmZqKzmCjPDGS8ivjRAeo4sow8pRNorAapZB762oQzBS7EjPhNRf_1w5rxfSt68X3wGwOh2yMHAuXQe10myXks' }
];

export default function MapView({ reports, onAddReport, onUpdateReportStatus }: MapViewProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [backendIncidents, setBackendIncidents] = useState<Array<{ incident_id: number; title: string; description: string; incident_type: string; status: string; longitude: number; latitude: number }>>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    apiRequest('/incidents').then((res) => {
      if (res.ok && Array.isArray(res.data)) {
        setBackendIncidents(res.data);
      } else {
        const detail = (res.data as { detail?: string }).detail;
        setBackendError(detail ?? 'Impossible de charger les incidents depuis le backend.');
      }
    });
  }, []);

  useEffect(() => {
    if (mapElement.current && !mapInstance.current) {
      mapInstance.current = L.map(mapElement.current, {
        center: [-4.325, 15.322],
        zoom: 12,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const addedMarkers: L.Marker[] = [];

    backendIncidents.forEach((incident) => {
      const marker = L.marker([incident.latitude, incident.longitude]).addTo(map);
      marker.bindPopup(`
        <strong>${incident.title}</strong><br />
        ${incident.description}<br />
        <small>Status: ${incident.status}</small>
      `);
      addedMarkers.push(marker);
    });

    return () => {
      addedMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });
    };
  }, [backendIncidents]);

  // New Report Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'organic' | 'plastic' | 'waste'>('organic');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'Faible' | 'Moyenne' | 'Élevée'>('Moyenne');
  const [details, setDetails] = useState('');
  const [selectedImgUrl, setSelectedImgUrl] = useState(MOCK_REPORT_IMAGES[0].url);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleMarkerClick = (id: string) => {
    setSelectedReportId(id);
  };

  const handleCloseBottomSheet = () => {
    setSelectedReportId(null);
  };

  const handleCreateReport = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !location || !details) {
      alert('Veuillez remplir tous les champs !');
      return;
    }

    // Determine coordinates from current map center if available
    const center = mapInstance.current?.getCenter();
    const latitude = center?.lat ?? -4.325;
    const longitude = center?.lng ?? 15.322;

    // Build payload expected by the backend JSON endpoint
    const payload = {
      title,
      description: details,
      incident_type: category,
      longitude,
      latitude,
    };

    const res = await apiRequest('/incidents/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = (res.data as { detail?: string }).detail ?? 'Erreur lors de l\'envoi du signalement.';
      alert(detail);
      return;
    }

    // Refetch incidents from backend to refresh markers
    const list = await apiRequest('/incidents');
    if (list.ok && Array.isArray(list.data)) setBackendIncidents(list.data);

    // Optionally keep local report behavior
    onAddReport({
      type: category,
      title,
      category: category === 'organic' ? 'Déchets Organiques' : category === 'plastic' ? 'Plastiques / Recyclage' : 'Déchets Résiduels',
      location,
      priority,
      image: selectedImgUrl,
      details,
      status: 'En attente'
    });

    // Reset Form
    setTitle('');
    setLocation('');
    setDetails('');
    setIsNewReportModalOpen(false);
  };

  const handleContribute = (report: Report) => {
    const nextStatusMap: Record<string, 'En attente' | 'En cours' | 'Résolu'> = {
      'En attente': 'En cours',
      'En cours': 'Résolu',
      'Résolu': 'En attente'
    };
    const nextStatus = nextStatusMap[report.status];
    onUpdateReportStatus(report.id, nextStatus);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simulate map panning or matching address
    alert(`Recherche de la localisation : "${searchQuery}". Recentrage de la carte simulé sur cette zone.`);
  };

  const getMarkerIcon = (type: 'organic' | 'plastic' | 'waste') => {
    switch (type) {
      case 'organic': return '🌱';
      case 'plastic': return '♻️';
      case 'waste': return '🗑️';
    }
  };

  const getMarkerBgColor = (type: 'organic' | 'plastic' | 'waste') => {
    switch (type) {
      case 'organic': return 'bg-emerald-600';
      case 'plastic': return 'bg-blue-600';
      case 'waste': return 'bg-amber-600';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px-72px)] bg-slate-100 overflow-hidden">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-0 right-0 z-50 px-4 pointer-events-auto">
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white/95 backdrop-blur-md shadow-lg border-none rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all font-sans relative z-50"
            placeholder="Rechercher une adresse, un quartier..."
          />
          <button
            type="button"
            onClick={() => alert('Localisation GPS simulée de l\'appareil.')}
            className="absolute inset-y-0 right-2 flex items-center px-3 text-primary hover:text-emerald-700 active:scale-90 transition-all"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Map wrapper (placed under overlays) */}
      <div className="w-full h-full relative z-0 map-wrapper">
        <div ref={mapElement} className="w-full h-full relative z-0" />
      </div>

      <div className="absolute top-4 right-4 z-50 max-w-xs bg-white/95 rounded-3xl border border-slate-200 shadow-xl p-4 text-xs text-slate-700 backdrop-blur-md">
        <h3 className="font-semibold text-slate-900 mb-2">Incidents backend</h3>
        {backendError ? (
          <p className="text-red-600">{backendError}</p>
        ) : backendIncidents.length === 0 ? (
          <p>Chargement en cours...</p>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {backendIncidents.slice(0, 5).map((incident) => (
              <div key={incident.incident_id} className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="font-semibold text-slate-800 truncate">{incident.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{incident.description}</p>
                <p className="mt-1 text-[11px] text-slate-600">Statut: {incident.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) to Add Report */}
      <button
        id="fab-add-report"
        onClick={() => setIsNewReportModalOpen(true)}
        className="absolute bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-all duration-200"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Details Bottom Sheet Overlay */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-100 max-w-lg mx-auto overflow-hidden"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center py-3 cursor-pointer" onClick={handleCloseBottomSheet}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-5 pb-6 pt-1">
              {/* Header inside details */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                      selectedReport!.type === 'organic' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      selectedReport!.type === 'plastic' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {selectedReport!.category}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                      selectedReport!.priority === 'Élevée' ? 'bg-red-50 text-red-700 border border-red-100' :
                      selectedReport!.priority === 'Moyenne' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                      'bg-slate-50 text-slate-700 border border-slate-100'
                    }`}>
                      {selectedReport!.priority} Priority
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-800 mt-1">{selectedReport!.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedReport!.location}
                  </p>
                </div>

                <button
                  onClick={handleCloseBottomSheet}
                  className="p-1.5 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid with photo and info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image display with dynamic fluid animation loader */}
                <div className="rounded-xl overflow-hidden h-40 bg-slate-100 border border-slate-100 shadow-inner">
                    <ImageWithLoader
                    src={selectedReport!.image}
                    alt={selectedReport!.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details info */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-2">
                      "{selectedReport!.details}"
                    </p>

                    <div className="h-[1px] bg-slate-100 my-2" />

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Statut :</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-2xs uppercase tracking-wider ${
                        selectedReport.status === 'Résolu' ? 'bg-emerald-500/15 text-emerald-700' :
                        selectedReport.status === 'En cours' ? 'bg-blue-500/15 text-blue-700' :
                        'bg-slate-500/15 text-slate-700'
                      }`}>
                        {selectedReport!.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Signalé par :</span>
                      <span className="font-medium text-slate-700">{selectedReport!.reportedBy}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Date :</span>
                      <span className="font-medium text-slate-700">{selectedReport!.reportedTime}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleContribute(selectedReport!)}
                      className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {selectedReport.status === 'En attente' ? 'Prendre en charge (Admin)' :
                         selectedReport.status === 'En cours' ? 'Marquer comme Résolu' : 'Réouvrir le ticket'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Report Modal */}
      <AnimatePresence>
        {isNewReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Signaler un Problème
                </h3>
                <button
                  onClick={() => setIsNewReportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Titre du signalement</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Sac poubelle déchiré, Dépôt de gravats..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Type de Déchet</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('organic')}
                      className={`py-2 px-3 rounded-xl border text-center transition-all font-semibold ${
                        category === 'organic' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🌱 Organique
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('plastic')}
                      className={`py-2 px-3 rounded-xl border text-center transition-all font-semibold ${
                        category === 'plastic' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ♻️ Plastique
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('waste')}
                      className={`py-2 px-3 rounded-xl border text-center transition-all font-semibold ${
                        category === 'waste' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🗑️ Résiduels
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Localisation / Adresse</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: 12 rue de la Paix, devant la boulangerie"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Priorité</label>
                  <div className="flex gap-4">
                    {['Faible', 'Moyenne', 'Élevée'].map((p) => (
                      <label key={p} className="flex items-center gap-1.5 font-medium text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={p}
                          checked={priority === p}
                          onChange={() => setPriority(p as any)}
                          className="text-primary focus:ring-primary"
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Choose Mock Photo */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Sélectionner une photo illustrative</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_REPORT_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setSelectedImgUrl(img.url)}
                        className={`relative rounded-lg overflow-hidden h-12 border-2 transition-all ${
                          selectedImgUrl === img.url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-75'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500 uppercase tracking-wider">Description détaillée</label>
                  <textarea
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    placeholder="Décrivez précisément l'état de l'emplacement pour guider les agents techniques municipaux..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-hidden resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Envoyer le signalement</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
