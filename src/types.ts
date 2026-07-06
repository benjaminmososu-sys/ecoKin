export interface Report {
  id: string;
  type: 'organic' | 'plastic' | 'waste';
  title: string;
  category: string;
  location: string;
  latPercent: number; // Percent from top for mock map
  lngPercent: number; // Percent from left for mock map
  status: 'En attente' | 'En cours' | 'Résolu';
  priority: 'Faible' | 'Moyenne' | 'Élevée';
  reportedBy: string;
  reportedTime: string;
  image: string;
  details: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  readTime: string;
  image: string;
  author: string;
  category: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
  avatarColor: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RecyclingItem {
  name: string;
  category: 'Organic' | 'Plastic' | 'Paper' | 'Electronic' | 'Hazardous' | 'Unknown';
  instructions: string;
}
