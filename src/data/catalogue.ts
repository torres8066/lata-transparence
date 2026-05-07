import { CatalogueItem } from '../types';

export const CATALOGUE: CatalogueItem[] = [
  {
    id: 'cat_001',
    intervention: 'Remplacement Plaquettes de Frein',
    pourquoi: "Les plaquettes assurent le pincement du disque pour ralentir le véhicule. Une usure excessive réduit considérablement la puissance de freinage et peut rayer définitivement vos disques, entraînant un surcoût important.",
    action: "Démontage des étriers, nettoyage des portées, remplacement du jeu de plaquettes par des pièces certifiées origine, et contrôle du niveau de liquide de frein.",
    conseil: "Évitez les freinages brusques pendant les 500 premiers kilomètres (période de rodage). Pensez à faire vérifier votre liquide de frein tous les 2 ans pour éviter une sensation de pédale molle."
  },
  {
    id: 'cat_002',
    intervention: 'Changement Vanne EGR',
    pourquoi: "La vanne EGR recycle une partie des gaz d'échappement pour réduire la pollution. En ville, elle s'encrasse de suie noire (calamine) et se bloque, ce qui étouffe le moteur, provoque des pertes de puissance et allume le voyant moteur.",
    action: "Extraction de la vanne grippée, nettoyage complet du conduit d'admission adjacent, et pose d'une vanne EGR neuve avec recalibrage électronique à la valise.",
    conseil: "Pour garder un moteur propre, n'hésitez pas à rouler sur voie rapide pendant 15 à 20 minutes à un régime soutenu (ex: 3000 tr/min en 4ème) une fois par mois. Cela permet de \"brûler\" la calamine."
  },
  {
    id: 'cat_003',
    intervention: 'Vidange et Remplacement Filtre à Huile',
    pourquoi: "L'huile lubrifie, nettoie et refroidit les pièces mécaniques en mouvement. Avec le temps et les kilomètres, elle se charge d'impuretés et perd ses propriétés, ce qui accélère l'usure du moteur.",
    action: "Vidange complète de l'huile usagée, remplacement du filtre à huile pour piéger les nouvelles impuretés, et remplissage avec une huile de synthèse haut de gamme adaptée à votre moteur.",
    conseil: "Vérifiez votre niveau d'huile tous les 2000 km avec la jauge manuelle, de préférence à froid et sur terrain plat. Ne vous fiez pas uniquement au voyant du tableau de bord, qui s'allume souvent trop tard."
  },
  {
    id: 'cat_004',
    intervention: 'Remplacement Courroie de Distribution',
    pourquoi: "La courroie synchronise le mouvement et le tempo parfait entre le haut et le bas de votre moteur. Si elle casse en roulant, les pièces internes se percutent, entraînant une destruction totale et irréversible du moteur.",
    action: "Remplacement préventif du kit complet de distribution (courroie + galets tendeurs) et de la pompe à eau, avec une purge complète du circuit de refroidissement.",
    conseil: "La courroie a une durée de vie limitée (en kilomètres ou en années). Respectez scrupuleusement l'échéance préconisée par le constructeur même si vous roulez peu : le caoutchouc vieillit même à l'arrêt."
  },
  {
    id: 'cat_005',
    intervention: 'Recharge Climatisation',
    pourquoi: "Le gaz réfrigérant s'échappe naturellement en infimes quantités au fil du temps. Quand la pression est trop basse, le système ne refroidit plus l'habitacle et le compresseur force à vide, risquant de s'endommager.",
    action: "Extraction de l'ancien gaz, tirage au vide pour éliminer l'humidité, test d'étanchéité du circuit, et recharge selon la quantité exacte préconisée, avec ajout d'un traceur UV pour détecter d'éventuelles fuites futures.",
    conseil: "Allumez votre climatisation au moins 10 minutes par mois, même en hiver ! Cela permet de lubrifier les joints du circuit et d'éventuelles micro-fuites."
  }
];
