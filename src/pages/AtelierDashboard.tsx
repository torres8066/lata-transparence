import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { FilePlus, QrCode, ExternalLink, Calendar, Car, ClipboardList, X, Pencil, Download, LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UrgencyLevel } from '../types';
import QRCode from 'react-qr-code';

export default function AtelierDashboard() {
// 1. On prépare un espace pour stocker les vrais rapports
  const [reports, setReports] = useState<any[]>([]);
  const [qrReportId, setQrReportId] = useState<string | null>(null);
  const qrReport = qrReportId ? reports.find(r => r.id === qrReportId) : null;

  // 2. LA LECTURE : On écoute Firebase en temps réel
  useEffect(() => {
    // On demande le tiroir "rapports", trié du plus récent au plus ancien
    const q = query(collection(db, "rapports"), orderBy("date", "desc"));
    
    // onSnapshot met à jour l'écran automatiquement dès qu'un dossier est ajouté !
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rapportsFirebase = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(rapportsFirebase);
    });

    return () => unsubscribe();
  }, []);

// Le QR Code pointe directement vers le dossier Firebase en public !
  const qrUrl = qrReport 
    ? `https://lata-transparence.vercel.app/rapport/${qrReport.id}` 
    : '';


  const downloadQRCode = () => {
    const container = document.getElementById('qr-code-wrapper');
    const svg = container?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Add padding and white background
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
         ctx.fillStyle = 'white';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(img, 20, 20);
         const pngFile = canvas.toDataURL('image/png');
         const downloadLink = document.createElement('a');
         downloadLink.download = `QR_Rapport_${qrReport?.plaque || 'client'}.png`;
         downloadLink.href = `${pngFile}`;
         downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Tableau de bord</h2>
          <p className="text-neutral-500 mt-1">Gérez vos rapports et diagnostics</p>
        </div>
        <Link 
          to="/nouveau" 
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-orange-600/20 w-full sm:w-auto"
        >
          <FilePlus size={20} />
          Nouveau Rapport
        </Link>
      </div>

      <div className="bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/50">
          <h3 className="font-semibold text-neutral-100">Rapports Récents</h3>
        </div>
        
        {reports.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <ClipboardList size={48} className="mx-auto mb-4 text-neutral-700 stroke-[1.5]" />
            <p className="text-lg font-medium text-neutral-300">Aucun rapport</p>
            <p className="mt-1">Créez votre premier rapport pour le présenter au client.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {reports.map((report, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={report.id} 
                className="p-4 sm:p-6 hover:bg-neutral-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl flex-shrink-0 mt-1 shadow-inner",
                    report.typeRapport === 'Diagnostic' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    report.typeRapport === 'Révision' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                    "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  )}>
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest",
                        report.typeRapport === 'Diagnostic' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        report.typeRapport === 'Révision' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}>
                        {report.typeRapport}
                      </span>
                      <UrgencyBadge urgency={report.degreUrgence} />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-100">{report.nomClient}</h4>
                    <div className="flex flex-wrap items-center text-sm font-medium text-neutral-500 gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Car size={16} />
                        <span className="uppercase tracking-wide font-mono text-xs">{report.plaque}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {format(new Date(report.date), 'dd MMM yy HH:mm', { locale: fr })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pl-14 md:pl-0">
                  <Link 
                    to={`/rapport/${report.id}`}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-neutral-700 hover:border-neutral-600"
                  >
                    <ExternalLink size={16} />
                    Ouvrir
                  </Link>
                  <Link 
                    to={`/editer/${report.id}`}
                    className="p-2 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors" 
                    title="Modifier le rapport"
                  >
                    <Pencil size={20} />
                  </Link>
                  <button 
                    className="p-2 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors" 
                    title="Code QR client"
                    onClick={() => setQrReportId(report.id)}
                  >
                    <QrCode size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {qrReportId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-6 max-w-sm w-full mx-auto flex flex-col items-center relative"
            >
              <button 
                onClick={() => setQrReportId(null)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-2xl tracking-tighter shadow-lg shadow-orange-600/20 mb-6">
                LG
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 text-center">Flashez pour voir le rapport</h3>
              <p className="text-sm text-neutral-400 text-center mb-8">
                Votre client peut scanner ce code pour accéder à son rapport sur son téléphone.
              </p>
              
              {qrUrl.length > 2900 ? (
                <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6">
                  Le rapport contient trop de texte pour être converti en QR code sans base de données. Veuillez réduire la taille des observations pour utiliser cette fonctionnalité hors-ligne.
                </div>
              ) : (
                <div id="qr-code-wrapper" className="bg-white p-4 rounded-xl shadow-inner mb-6">
                  <QRCode value={qrUrl} size={200} />
                </div>
              )}
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={downloadQRCode}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-orange-600/20"
                >
                  <Download size={18} />
                  Télécharger pour facture
                </button>
                
                <Link 
                  to={`/rapport/${qrReportId}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors border border-neutral-700 hover:border-neutral-600"
                >
                  <ExternalLink size={18} />
                  Ouvrir le lien
                </Link>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(qrUrl);
                    alert('Lien copié dans le presse-papier !');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <LinkIcon size={18} />
                  Copier le lien direct
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  if (urgency === 'Aucune') return null;
  
  const colors = {
    'Faible': 'bg-neutral-800 text-neutral-400 border border-neutral-700',
    'Moyenne': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    'Haute': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    'Critique': 'bg-red-500/10 text-red-500 border border-red-500/20'
  };

  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest", colors[urgency])}>
      Urgence: {urgency}
    </span>
  );
}
