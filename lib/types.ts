export type Niveau = "débutant" | "intermédiaire" | "avancé";

export type Domaine =
  | "frontend"
  | "backend"
  | "base de données"
  | "workflow"
  | "agents IA"
  | "CLI / terminal"
  | "Claude Code"
  | "sécurité"
  | "DevOps / déploiement";

export type Statut = "publié" | "suggéré";

export interface Terme {
  slug: string;
  label: string;
  niveau: Niveau;
  domaine: Domaine;
  definition: string;
  exemple_code?: string;
  langue_code?: string;
  lien_externe?: string;
  termes_lies: string[];
  statut: Statut;
}

export const NIVEAUX: Niveau[] = ["débutant", "intermédiaire", "avancé"];

export const DOMAINES: Domaine[] = [
  "frontend",
  "backend",
  "base de données",
  "workflow",
  "agents IA",
  "CLI / terminal",
  "Claude Code",
  "sécurité",
  "DevOps / déploiement",
];
