import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { CATALOGUE } from '../data/catalogue';
import { ClientReport, ReportType, UrgencyLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Save, ArrowLeft, Car, AlertCircle, Wrench, Search, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function CreateReport() {
  const navigate = useNavigate();
  const addReport = useAppStore(state => state.addReport);

  const [formData, setFormData] = useState<Partial<ClientReport>>({
    typeRapport: 'Diagnostic',
    degreUrgence: 'Aucune',
  });

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.interventionId) return alert('Veuillez sélectionner une intervention.');
    
    // 1. On prépare le rapport avec un ID unique
    const newReport: ClientReport = {
      ...(formData as ClientReport),
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    
    try {
      // 2. LA MAGIE : On sauvegarde dans le coffre-fort Firebase !
      await setDoc(doc(db, "rapports", newReport.id), newReport);
      
      // 3. On met à jour l'affichage local
      addReport(newReport);
      
      // 4. On redirige vers l'accueil
      navigate('/');
    } catch (error) {
      console.error("Erreur Firebase :", error);
      alert("Erreur lors de la sauvegarde du rapport dans la base de données.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 5 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, lienPhotoValise: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 text-neutral-400 hover:text-neutral-100 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 rounded-xl transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Nouveau Rapport Client</h2>
          <p className="text-neutral-500 mt-1">Saisissez les informations techniques de l'atelier.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Type de rapport */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl border border-neutral-800 space-y-4">
          <h3 className="font-semibold text-neutral-100 flex items-center gap-2">
            <ClipboardIcon /> Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Type de Rapport</label>
              <select 
                name="typeRapport" 
                value={formData.typeRapport} 
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                required
              >
                <option value="Diagnostic">Diagnostic (Expliquer la panne)</option>
                <option value="Révision">Révision (Bilan de santé)</option>
                <option value="Sortie de travaux">Sortie de travaux (Preuve & Conseils)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Degré d'Urgence</label>
              <select 
                name="degreUrgence" 
                value={formData.degreUrgence} 
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                required
              >
                <option value="Aucune">Aucune (Entretien courant)</option>
                <option value="Faible">Faible (À surveiller)</option>
                <option value="Moyenne">Moyenne (Prévoir réparation)</option>
                <option value="Haute">Haute (Risque d'aggravation)</option>
                <option value="Critique">Critique (Danger grave / Immo immédiate)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client & Véhicule */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl border border-neutral-800 space-y-4">
          <h3 className="font-semibold text-neutral-100 flex items-center gap-2">
            <Car className="text-neutral-500" size={18} /> Client & Véhicule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Nom du client</label>
              <input 
                type="text" 
                name="nomClient" 
                value={formData.nomClient || ''} 
                onChange={handleChange}
                placeholder="Ex: M. Dupont"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-neutral-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Plaque d'immatriculation</label>
              <input 
                type="text" 
                name="plaque" 
                value={formData.plaque || ''} 
                onChange={handleChange}
                placeholder="Ex: AB-123-CD"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono uppercase placeholder:text-neutral-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Kilométrage</label>
              <input 
                type="number" 
                name="kilometrage" 
                value={formData.kilometrage || ''} 
                onChange={handleChange}
                placeholder="Ex: 125000"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-neutral-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Atelier */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl border border-neutral-800 space-y-4">
          <h3 className="font-semibold text-neutral-100 flex items-center gap-2">
            <Search className="text-neutral-500" size={18} /> Diagnostic Atelier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Symptômes remontés par le client</label>
              <textarea 
                name="symptomesClient" 
                value={formData.symptomesClient || ''} 
                onChange={handleChange}
                placeholder="Ex: Bruit de claquement à l'avant droit lors des freinages..."
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[80px] placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Codes Défauts (Valise)</label>
              <input 
                type="text" 
                name="codesDefauts" 
                value={formData.codesDefauts || ''} 
                onChange={handleChange}
                placeholder="Ex: P0401, P0300"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Preuve photo / capture valise (Optionnel)</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-100 rounded-xl px-4 py-2.5 transition-all flex items-center justify-center gap-2 border-dashed">
                  <Upload size={18} className="text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-400">Importer une image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.lienPhotoValise && (
                 <div className="mt-3 relative inline-block rounded-xl overflow-hidden border border-neutral-800 p-1">
                   <img src={formData.lienPhotoValise} alt="Aperçu" className="h-20 w-auto object-cover rounded-lg" />
                   <button type="button" onClick={() => setFormData(p => ({...p, lienPhotoValise: ''}))} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"><X size={14}/></button>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Choix de l'intervention (Pont vers le Catalogue) */}
        <div className="bg-orange-950/20 p-6 rounded-2xl shadow-xl border border-orange-500/20 space-y-4">
          <h3 className="font-semibold text-orange-400 flex items-center gap-2">
            <Wrench className="text-orange-500" size={18} /> Plan d'Action (Catalogue)
          </h3>
          <p className="text-sm text-orange-200/60 mb-2">Sélectionnez l'intervention. L'explication pédagogique sera automatiquement ajoutée au rapport du client.</p>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1">Sélection de l'Intervention</label>
              <select 
                name="interventionId" 
                value={formData.interventionId || ''} 
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-orange-500/30 text-neutral-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                required
              >
                <option value="" disabled>-- Choisir une intervention du catalogue --</option>
                {CATALOGUE.map(item => (
                  <option key={item.id} value={item.id}>{item.intervention}</option>
                ))}
              </select>
            </div>

            {formData.interventionId && (
              <div className="bg-neutral-950/50 p-4 rounded-xl border border-orange-500/20 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1 block">Aperçu pour le client :</span>
                <p className="text-sm text-neutral-300 line-clamp-2 italic">
                  "{CATALOGUE.find(c => c.id === formData.interventionId)?.pourquoi}"
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1 mt-2">Observations spécifiques du mécanicien</label>
              <textarea 
                name="observationsMecano" 
                value={formData.observationsMecano || ''} 
                onChange={handleChange}
                placeholder="Ex: Disques de frein à vérifier à la prochaine révision..."
                className="w-full bg-neutral-900 border border-orange-500/20 text-neutral-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[100px] placeholder:text-neutral-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1 mt-2">Lien vidéo explicative (Optionnel)</label>
              <input 
                type="url"
                name="lienVideoExplicative" 
                value={formData.lienVideoExplicative || ''} 
                onChange={handleChange}
                placeholder="Ex: https://youtube.com/..."
                className="w-full bg-neutral-900 border border-orange-500/20 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono placeholder:text-neutral-600 text-sm"
              />
              <p className="text-[10px] text-orange-200/50 mt-1">Collez un lien YouTube, Vimeo ou autre pour accompagner le "pourquoi" (moins de 2 min recommandé).</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <Link 
            to="/" 
            className="px-6 py-3 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Annuler
          </Link>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
          >
            <Save size={18} />
            Générer le Rapport
          </button>
        </div>

      </form>
    </div>
  );
}

function ClipboardIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
}
