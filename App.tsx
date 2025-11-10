import React, { useState, useCallback, useEffect } from 'react';
import { AppScreen, Patient, Triage, Attendant, Doctor, Room, Specialty, AITriageResult, ChatMessage } from './types';
import HomePage from './components/HomePage';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationForm from './components/RegistrationForm';
import ChatInterface from './components/ChatInterface';
import SummaryScreen from './components/SummaryScreen';
import InitialSymptomInput from './components/InitialSymptomInput';
import AttendantDashboard from './components/AttendantDashboard';
import AdminDashboard from './components/AdminDashboard';
import PatientViewScreen from './components/PatientViewScreen';
import { v4 as uuidv4 } from 'uuid';

// Mock Data
const initialDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. João Silva', specialtyId: 's1' },
  { id: 'd2', name: 'Dra. Maria Oliveira', specialtyId: 's2' },
  { id: 'd3', name: 'Dr. Carlos Pereira', specialtyId: 's3' },
];
const initialSpecialties: Specialty[] = [
  { id: 's1', name: 'Clínico Geral' },
  { id: 's2', name: 'Ortopedia' },
  { id: 's3', name: 'Cardiologia' },
];
const initialRooms: Room[] = [
  { id: 'r1', name: 'Consultório 1', currentDoctorId: 'd1' },
  { id: 'r2', name: 'Consultório 2', currentDoctorId: 'd2' },
  { id: 'r3', name: 'Sala de Trauma', currentDoctorId: 'd3' },
];


function App() {
  const [screen, setScreen] = useState<AppScreen>('HOME');
  const [viewProtocol, setViewProtocol] = useState<string | null>(null);
  
  // --- "Database" State ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [triages, setTriages] = useState<Triage[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  // --- Current Session State ---
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentTriage, setCurrentTriage] = useState<Triage | null>(null);
  const [initialSymptom, setInitialSymptom] = useState<string>('');
  
  // --- Routing and Data Persistence ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const protocol = params.get('protocol');
    if (protocol) {
      setViewProtocol(protocol);
      setScreen('PATIENT_VIEW');
    } else {
      setScreen('HOME');
    }

    try {
      const stored = (key: string) => localStorage.getItem(`saudeMais-${key}`);
      setPatients(JSON.parse(stored('patients') || '[]'));
      setTriages(JSON.parse(stored('triages') || '[]'));
      const storedAttendants = stored('attendants');
      if (storedAttendants && storedAttendants !== '[]') {
        setAttendants(JSON.parse(storedAttendants));
      } else {
        setAttendants([{ id: uuidv4(), fullName: 'Admin Master', email: 'admin@saudemais.com', role: 'admin' }]);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  useEffect(() => { localStorage.setItem('saudeMais-patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('saudeMais-triages', JSON.stringify(triages)); }, [triages]);
  useEffect(() => { localStorage.setItem('saudeMais-attendants', JSON.stringify(attendants)); }, [attendants]);


  // --- State Transition Callbacks ---
  const handleStartTotem = () => setScreen('TOTEM_REGISTRATION');

  const handleRegistrationComplete = useCallback((patientData: Omit<Patient, 'id' | 'isPriority'> & { age: number }) => {
    const newPatient: Patient = { 
      ...patientData, 
      id: uuidv4(),
      isPriority: patientData.age >= 60
    };
    setCurrentPatient(newPatient);
    setScreen('TOTEM_SYMPTOM');
  }, []);

  const handleSymptomSubmit = useCallback((symptom: string) => {
      setInitialSymptom(symptom);
      setScreen('TOTEM_TRIAGE');
  }, []);

  const handleTriageComplete = useCallback((result: AITriageResult, chatHistory: ChatMessage[]) => {
    if (!currentPatient) return;
    
    setPatients(prev => [...prev, currentPatient]);
    
    const lastPasswordNum = parseInt(localStorage.getItem('saudeMais-lastPassword') || '0', 10);
    const newPasswordNum = lastPasswordNum + 1;
    localStorage.setItem('saudeMais-lastPassword', newPasswordNum.toString());
    
    const passwordPrefix = currentPatient.isPriority ? 'P' : 'G';
    const password = passwordPrefix + String(newPasswordNum).padStart(3, '0');
    const protocol = `PRT-${Date.now()}`;

    const newTriage: Triage = {
      id: uuidv4(),
      patientId: currentPatient.id,
      protocol,
      password,
      riskLevel: result.grau_risco,
      summary: result.resumo_triagem,
      initialSymptoms: initialSymptom,
      status: 'aguardando',
      createdAt: new Date().toISOString(),
      chatHistory,
    };
    
    setTriages(prev => [...prev, newTriage]);
    setCurrentTriage(newTriage);
    setScreen('TOTEM_RESULT');
  }, [currentPatient, initialSymptom]);
  
  const handleStartOver = useCallback(() => {
    setCurrentPatient(null);
    setCurrentTriage(null);
    setInitialSymptom('');
    setViewProtocol(null);
    // Clear URL params without reloading
    window.history.pushState({}, document.title, window.location.pathname);
    setScreen('HOME');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'HOME':
        return <HomePage setScreen={setScreen} />;
      case 'TOTEM_WELCOME':
        return <WelcomeScreen onStart={handleStartTotem} />;
      case 'TOTEM_REGISTRATION':
        return <RegistrationForm onSubmit={handleRegistrationComplete} />;
      case 'TOTEM_SYMPTOM':
        return <InitialSymptomInput onSubmit={handleSymptomSubmit} />;
      case 'TOTEM_TRIAGE':
        return currentPatient && <ChatInterface patient={currentPatient} initialSymptom={initialSymptom} onComplete={handleTriageComplete} />;
      case 'TOTEM_RESULT':
        return currentTriage && currentPatient && <SummaryScreen triage={currentTriage} patient={currentPatient} onStartOver={handleStartOver} />;
      case 'PATIENT_VIEW':
        return viewProtocol && <PatientViewScreen protocol={viewProtocol} triages={triages} patients={patients} onBack={handleStartOver} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard 
                  attendants={attendants}
                  setAttendants={setAttendants}
                  onExit={handleStartOver}
                />;
      case 'ATTENDANT_DASHBOARD':
        return <AttendantDashboard 
                  patients={patients} 
                  triages={triages}
                  onExit={handleStartOver}
               />;
      default:
        return <HomePage setScreen={setScreen} />;
    }
  };
  
  const isHomePage = screen === 'HOME';
  const isDashboard = ['ADMIN_DASHBOARD', 'ATTENDANT_DASHBOARD'].includes(screen);
  const isTotemFlow = ['TOTEM_WELCOME', 'TOTEM_REGISTRATION', 'TOTEM_SYMPTOM', 'TOTEM_TRIAGE', 'TOTEM_RESULT'].includes(screen) || screen === 'PATIENT_VIEW';

  const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isHomePage) {
      return <>{children}</>;
    }
    
    if (isDashboard) {
       return <div className="font-inter bg-gray-100">{children}</div>;
    }
    
    if (isTotemFlow) {
      return (
        <div className="min-h-screen font-inter flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      );
    }
    
    return <>{children}</>;
  };


  return (
    <LayoutWrapper>
      {renderScreen()}
    </LayoutWrapper>
  );
}

export default App;