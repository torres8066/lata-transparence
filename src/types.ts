export type ReportType = 'Diagnostic' | 'Révision' | 'Sortie de travaux';

export type UrgencyLevel = 'Aucune' | 'Faible' | 'Moyenne' | 'Haute' | 'Critique';

export interface CatalogueItem {
  id: string;
  intervention: string;
  pourquoi: string;
  action: string;
  conseil: string;
}

export interface ClientReport {
  id: string; // ID Unique
  date: string; // ISO String
  typeRapport: ReportType;
  nomClient: string;
  plaque: string;
  kilometrage: number;
  symptomesClient: string;
  codesDefauts: string;
  interventionId: string; // Lien Catalogue
  degreUrgence: UrgencyLevel;
  observationsMecano: string;
  lienPhotoValise?: string;
  lienVideoExplicative?: string;
  lienPdf?: string;
}
