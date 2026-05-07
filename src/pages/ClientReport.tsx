import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { CATALOGUE } from '../data/catalogue';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DownloadCloud, ImageIcon, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReportType, UrgencyLevel, ClientReport as ClientReportType } from '../types';

export default function ClientReport() {
  const { id } = useParams();
  const reports = useAppStore(state => state.reports);
  const location = useLocation();
  
  const report = useMemo(() => {
    // 1. Check if data is passed via URL query parameter "d"
    const searchParams = new URLSearchParams(location.search);
    const dataEncoded = searchParams.get('d');
    if (dataEncoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataEncoded)));
        return decoded as ClientReportType;
      } catch (e) {
        console.error("Failed to decode report from URL", e);
      }
    }
    // 2. Fallback to local storage using the id parameter
    return id ? reports.find(r => r.id === id) : null;
  }, [id, reports, location.search]);

  const catalogueItem = useMemo(() => report ? CATALOGUE.find(c => c.id === report.interventionId) : null, [report]);

  if (!report || !catalogueItem) {
    return (
      <div className="h-screen w-full bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="text-center font-sans">
          <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 uppercase tracking-widest mb-2">Rapport introuvable</h1>
          <p className="text-neutral-500 text-sm">Le lien scanné est invalide ou expiré.</p>
        </div>
      </div>
    );
  }

  const isDiagnostic = report.typeRapport === 'Diagnostic';
  const isRevision = report.typeRapport === 'Révision';

  return (
    <div className="min-h-screen lg:h-screen w-full bg-neutral-950 text-neutral-100 font-sans flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 flex-none border-b border-neutral-800 flex items-center justify-between px-4 sm:px-8 bg-neutral-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter shadow-lg shadow-orange-600/20">LG</div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">LATA GARAGE</h1>
            <p className="text-[10px] sm:text-xs text-neutral-400">Pack Transparence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest">Type de Rapport</span>
            <span className={cn(
              "text-xs sm:text-sm font-mono font-medium",
              isDiagnostic ? "text-red-400" : isRevision ? "text-blue-400" : "text-emerald-400"
            )}>#{report.typeRapport.toUpperCase()}</span>
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-neutral-800"></div>
          <button className="hidden sm:inline-block px-4 py-2 bg-neutral-800 rounded-full text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            Bonjour {report.nomClient}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 sm:p-6 gap-6">
        
        {/* Sidebar: Car Identity & Constat */}
        <section className="w-full lg:w-80 flex flex-col gap-4 flex-none lg:overflow-y-auto scoldbar-hide">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex-none">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase mb-4 tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
              Identité Véhicule
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1 mt-0.5">Immatriculation</div>
                <div className="text-lg font-mono font-bold text-blue-400 tracking-wider uppercase">{report.plaque}</div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1 mt-0.5">Km</div>
                  <div className="text-base font-medium">{report.kilometrage.toLocaleString('fr-FR')}</div>
                </div>
                <div className="flex-1 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1 mt-0.5">Date</div>
                  <div className="text-base font-medium">{format(new Date(report.date), 'dd/MM/yy')}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {(isDiagnostic || isRevision) && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col flex-none">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase mb-3 tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                Symptômes & Diagnostic
              </h2>
              {report.symptomesClient ? (
                <p className="text-sm text-neutral-300 italic leading-relaxed">"{report.symptomesClient}"</p>
              ) : (
                <p className="text-sm text-neutral-600 italic leading-relaxed">Aucun symptôme renseigné.</p>
              )}
              
              {report.codesDefauts && (
                <div className="mt-4 pt-4 border-t border-neutral-800/50">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-2">Code Défaut Valise</div>
                  <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/50 px-3 py-2 rounded-lg text-red-400 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {report.codesDefauts}
                  </div>
                </div>
              )}
              
              {report.degreUrgence !== 'Aucune' && (
                <div className="mt-4 pt-4 border-t border-neutral-800/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Degré d'urgence</span>
                    <UrgencyIndicator level={report.degreUrgence} />
                  </div>
                  <ProgressBar level={report.degreUrgence} />
                </div>
              )}
            </motion.div>
          )}
        </section>

        {/* Main Content: The Report */}
        <section className="flex-1 flex flex-col gap-6 lg:overflow-y-auto scoldbar-hide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex-none">
            {/* Phase Indicator */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl shadow-lg shadow-orange-600/20">Phase: {report.typeRapport}</div>
            
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="xl:w-1/2 mt-4 xl:mt-0">
                 <h2 className="text-2xl font-bold mb-4 tracking-tight leading-tight pr-4">{catalogueItem.intervention}</h2>
                 
                 <div className="space-y-5">
                    <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
                      <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2">
                         <span className="flex items-center justify-center w-4 h-4 rounded bg-neutral-800 text-neutral-400 text-[9px]">1</span>
                         Le Pourquoi (Explication)
                      </label>
                      <p className="text-sm text-neutral-300 leading-relaxed">{catalogueItem.pourquoi}</p>
                    </div>
                    <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
                      <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2">
                         <span className="flex items-center justify-center w-4 h-4 rounded bg-neutral-800 text-neutral-400 text-[9px]">2</span>
                         Notre Action
                      </label>
                      <p className="text-sm text-neutral-300 leading-relaxed">{catalogueItem.action}</p>
                    </div>

                    {report.lienVideoExplicative && (
                      <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
                        <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-3">
                           <span className="flex items-center justify-center w-4 h-4 rounded bg-neutral-800 text-neutral-400 text-[9px]">3</span>
                           Vidéo Explicative
                        </label>
                        <a 
                          href={report.lienVideoExplicative} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/30 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                        >
                           <PlayCircle size={18} />
                           Voir la vidéo (moins de 2 min)
                        </a>
                      </div>
                    )}
                 </div>
              </div>
              <div className="xl:w-1/2 h-64 xl:h-auto min-h-[250px] bg-neutral-950 rounded-xl border border-neutral-800 relative overflow-hidden group">
                {report.lienPhotoValise ? (
                  <img src={report.lienPhotoValise} alt="Preuve Valise" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-800">
                     <ImageIcon size={64} strokeWidth={1} />
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur px-3 py-1.5 rounded text-[10px] font-medium border border-white/10 uppercase tracking-widest">
                  {report.lienPhotoValise ? "Photo Atelier / Valise" : "Aucune photo jointe"}
                </div>
                
                {/* Simulation of a high-tech overlay */}
                <div className="absolute inset-0 border-2 border-orange-500/10 pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-orange-500/50"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-orange-500/50"></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-none max-h-min">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Le Conseil du Pro
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed flex-grow">
                {catalogueItem.conseil}
              </p>
              
              {report.observationsMecano && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-2">Observation Spécifique</div>
                  <p className="text-xs text-neutral-400 italic font-medium leading-relaxed">"{report.observationsMecano}"</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-900/50 border border-orange-500 flex items-center justify-center font-bold text-[10px] text-orange-200 uppercase">LG</div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-500">Expertise</div>
                  <div className="text-xs font-bold text-neutral-300">Atelier LATA</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-orange-950/20 border border-orange-500/20 rounded-2xl p-5 relative flex flex-col justify-between">
               <div>
                 <h3 className="text-xs font-semibold text-orange-400 uppercase mb-4 tracking-widest">Score Transparence</h3>
                 <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-bold text-orange-500 tracking-tighter">98</span>
                    <span className="text-xl font-bold text-orange-500 opacity-50 mb-1">%</span>
                 </div>
                 <p className="text-[11px] text-orange-300/80 uppercase tracking-wide leading-relaxed">Ce rapport contient toutes les preuves techniques nécessaires à votre prise de décision.</p>
               </div>
               
               <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5"><span className="text-neutral-500">Pédagogie</span><span className="text-orange-400">10/10</span></div>
                    <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/50">
                      <div className="h-full bg-orange-500 w-[100%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5"><span className="text-neutral-500">Précision Technique</span><span className="text-orange-400">9.5/10</span></div>
                    <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/50">
                      <div className="h-full bg-orange-500 w-[95%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="h-14 flex-none border-t border-neutral-800 bg-neutral-900 flex items-center justify-between px-4 sm:px-8 text-[10px] sm:text-[11px] text-neutral-500 overflow-x-auto whitespace-nowrap scoldbar-hide">
        <div className="flex items-center gap-4 sm:gap-6 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Système Actif</span>
          <span className="hidden sm:inline-block text-neutral-600">ID: {report.id.substring(0,8).toUpperCase()}</span>
        </div>
        <div className="flex gap-3">
           {report.lienPdf ? (
             <a href={report.lienPdf} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors rounded text-[10px] font-bold uppercase tracking-widest border border-neutral-700">
                <DownloadCloud size={14} /> Voir Devis PDF
             </a>
           ) : (
             <span className="px-3 py-1.5 bg-neutral-950 rounded text-neutral-600 border border-neutral-800 uppercase tracking-widest font-bold">Sans valeur contractuelle</span>
           )}
        </div>
      </footer>
    </div>
  );
}

// Helpers

function UrgencyIndicator({ level }: { level: UrgencyLevel }) {
  const colors = {
    'Faible': 'text-neutral-400',
    'Moyenne': 'text-amber-400',
    'Haute': 'text-orange-400',
    'Critique': 'text-red-500',
    'Aucune': 'text-neutral-600'
  };
  return (
    <span className={cn("font-bold uppercase tracking-widest text-[10px]", colors[level])}>
      {level.toUpperCase()}
    </span>
  );
}

function ProgressBar({ level }: { level: UrgencyLevel }) {
  const levels = ['Faible', 'Moyenne', 'Haute', 'Critique'];
  const currentIndex = levels.indexOf(level as any);
  
  if (currentIndex === -1) return null;

  return (
    <div className="flex gap-1 h-1.5 w-full">
      {levels.map((l, i) => {
        const isActive = i <= currentIndex;
        
        let colorClass = 'bg-neutral-800 border border-neutral-800/50';
        if (isActive) {
          if (level === 'Faible') colorClass = 'bg-neutral-400 border-neutral-400';
          else if (level === 'Moyenne') colorClass = i === 0 ? 'bg-amber-400/50 border-amber-400/50' : 'bg-amber-500 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
          else if (level === 'Haute') colorClass = i <= 1 ? 'bg-orange-500/50 border-orange-500/50' : 'bg-orange-600 border-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.5)]';
          else colorClass = 'bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
        }

        return (
          <div key={l} className={cn("flex-1 rounded-full transition-all duration-700", colorClass)} />
        );
      })}
    </div>
  );
}

