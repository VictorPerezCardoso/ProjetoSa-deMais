// --- Core Enums and Types ---
export type RiskLevel = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'indefinido';
export type AppScreen = 'HOME' | 'TOTEM_WELCOME' | 'TOTEM_REGISTRATION' | 'TOTEM_SYMPTOM' | 'TOTEM_TRIAGE' | 'TOTEM_RESULT' | 'ATTENDANT_DASHBOARD' | 'ADMIN_DASHBOARD' | 'PATIENT_VIEW';

export interface RiskProfile {
  level: RiskLevel;
  name: string;
  colorClass: string;
  bgColorClass: string;
}

// --- "Database" Table Interfaces ---
export interface Patient {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  isPriority: boolean;
}

export interface Attendant {
  id: string;
  fullName: string;
  email: string;
  role: 'atendente' | 'admin';
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
}

export interface Specialty {
  id: string;
  name: string;
}

export interface Room {
  id:string;
  name: string;
  currentDoctorId: string | null;
}


// --- Transactional Interfaces ---
export interface Triage {
  id: string;
  patientId: string;
  protocol: string;
  password: string;
  riskLevel: RiskLevel;
  summary: string;
  initialSymptoms: string;
  status: 'aguardando' | 'em_atendimento' | 'finalizado';
  createdAt: string; // ISO String
  chatHistory?: ChatMessage[];
}

// --- AI & Chat Interfaces ---
export interface AITriageResult {
  resumo_triagem: string;
  grau_risco: RiskLevel;
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ia';
    text: string;
}