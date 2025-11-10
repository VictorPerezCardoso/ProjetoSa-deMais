import React, { useMemo } from 'react';
import { Patient, Triage } from '../types';
import { RISK_PROFILES } from '../constants';

interface PatientViewScreenProps {
  protocol: string;
  triages: Triage[];
  patients: Patient[];
  onBack: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 ${className}`}>
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
    {children}
  </div>
);

const PatientViewScreen: React.FC<PatientViewScreenProps> = ({ protocol, triages, patients, onBack }) => {

  const data = useMemo(() => {
    const triage = triages.find(t => t.protocol === protocol);
    if (!triage) return null;
    const patient = patients.find(p => p.id === triage.patientId);
    if (!patient) return null;
    const riskProfile = RISK_PROFILES[triage.riskLevel] || RISK_PROFILES.indefinido;
    return { triage, patient, riskProfile };
  }, [protocol, triages, patients]);

  if (!data) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-red-600">Protocolo não encontrado</h2>
        <p className="text-gray-600 mt-2">O protocolo "{protocol}" não foi localizado. Por favor, verifique o link ou o QR Code.</p>
        <button onClick={onBack} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full">Voltar ao Início</button>
      </div>
    );
  }

  const { triage, patient, riskProfile } = data;

  // FIX: Changed JSX.Element to React.ReactElement to fix "Cannot find namespace 'JSX'" error.
  const statusMessages: Record<string, {text: string, icon: React.ReactElement}> = {
      aguardando: { text: "Você está na fila para atendimento. Aguarde sua chamada pelo número de protocolo.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
      em_atendimento: { text: "Você está sendo atendido. Siga as orientações da equipe médica.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /> },
      finalizado: { text: "Seu atendimento foi finalizado. Desejamos uma boa recuperação.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  }

  return (
    <div className="animate-fade-in w-full max-w-md mx-auto">
        <header className="text-center mb-6">
            <h1 className="text-3xl font-poppins font-bold text-[#1E2559]">Saúde Mais</h1>
            <p className="text-gray-500 font-inter">Portal do Paciente</p>
            <p className="font-mono text-sm text-gray-500 mt-1">Protocolo: {triage.protocol}</p>
        </header>

        <div className="space-y-4">
          <InfoCard title="Nome do Paciente">
            <p className="text-3xl font-bold text-gray-900">{patient.fullName}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
                <div>
                    <p className="text-xs text-gray-500">IDADE</p>
                    <p className="text-lg font-semibold text-gray-800">{patient.age} anos</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500">TELEFONE</p>
                    <p className="text-lg font-semibold text-gray-800">{patient.phone}</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500">SENHA</p>
                    <p className="text-2xl font-bold text-blue-600 font-mono">{triage.password}</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500">IDOSO</p>
                    <p className={`text-lg font-bold ${patient.isPriority ? 'text-blue-600' : 'text-gray-800'}`}>{patient.isPriority ? 'Sim' : 'Não'}</p>
                </div>
            </div>
          </InfoCard>

          <div className={`rounded-2xl p-6 text-center shadow-lg border-2 ${riskProfile.bgColorClass.replace('bg-', 'border-')}`}>
              <p className={`text-sm font-semibold uppercase tracking-wider ${riskProfile.colorClass}`}>Nível de Risco</p>
              <p className="text-3xl font-bold text-gray-800 capitalize">{riskProfile.name}</p>
          </div>

          <InfoCard title="Sintomas Relacionados (Resumo da IA)">
            <p className="text-gray-700">{triage.summary || 'Nenhum sintoma detalhado registrado.'}</p>
          </InfoCard>

          {triage.chatHistory && triage.chatHistory.length > 0 && (
            <InfoCard title="Histórico da Conversa">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {triage.chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                             {msg.sender === 'ia' && (
                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">IA</div>
                            )}
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-gray-100 text-gray-800 rounded-br-none' : 'bg-blue-50 text-blue-900 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfoCard>
          )}

          <InfoCard title="Status do Atendimento">
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {statusMessages[triage.status].icon}
              </svg>
              <p className="text-gray-700">{statusMessages[triage.status].text}</p>
            </div>
          </InfoCard>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
            <p className="font-bold">Importante</p>
            <p className="text-sm">Mantenha este número de protocolo à mão. Você será chamado por este número quando sua consulta estiver pronta.</p>
          </div>
        </div>

         <div className="text-center mt-6">
             <button onClick={onBack} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Voltar</button>
        </div>
    </div>
  );
};

export default PatientViewScreen;