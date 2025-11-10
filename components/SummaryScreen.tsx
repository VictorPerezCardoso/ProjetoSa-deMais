import React, { useState, useEffect } from 'react';
import { Triage, Patient, RiskLevel } from '../types';
import { RISK_PROFILES } from '../constants';
import { QRCodeCanvas } from 'qrcode.react';

interface SummaryScreenProps {
  triage: Triage;
  patient: Patient;
  onStartOver: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ triage, patient, onStartOver }) => {
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    // Se o usuário clicar no botão, o componente é desmontado e o timer é limpo.
    // Se o timer chegar a zero, onStartOver é chamado.
    if (countdown <= 0) {
      onStartOver();
      return;
    }

    const timerId = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(timerId);
  }, [countdown, onStartOver]);

  const patientViewUrl = `${window.location.origin}${window.location.pathname}?protocol=${triage.protocol}`;
  const riskProfile = RISK_PROFILES[triage.riskLevel] || RISK_PROFILES.indefinido;
  
  const riskCardStyles: Record<RiskLevel, { border: string; bg: string; text: string; tagBg: string }> = {
    vermelho: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-700', tagBg: 'bg-red-100' },
    laranja: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-700', tagBg: 'bg-orange-100' },
    amarelo: { border: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-700', tagBg: 'bg-yellow-100' },
    verde: { border: 'border-green-300', bg: 'bg-green-50', text: 'text-green-700', tagBg: 'bg-green-100' },
    indefinido: { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-700', tagBg: 'bg-gray-100' },
  };

  const styles = riskCardStyles[triage.riskLevel] || riskCardStyles.indefinido;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center animate-fade-in w-full">
      <h2 className="text-5xl font-bold font-poppins text-gray-800">Triagem Concluída!</h2>
      <p className="text-lg text-gray-600 mt-4 mb-10 max-w-md mx-auto">Obrigado, {patient.fullName.split(' ')[0]}. Por favor, guarde sua senha e aguarde ser chamado.</p>
      
      {/* Card da Senha */}
      <div className={`w-full mx-auto rounded-2xl p-6 text-center shadow-md border-2 ${styles.bg} ${styles.border}`}>
        <p className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`}>Sua Senha</p>
        <p className="text-9xl font-bold text-gray-800 tracking-wider my-1">{triage.password}</p>
        <div className={`inline-block mt-2 px-4 py-1.5 text-base font-semibold rounded-full ${styles.tagBg} ${riskProfile.colorClass}`}>
            {riskProfile.name}
        </div>
      </div>

      {/* Card do QR Code */}
      <div className="mt-6 p-6 rounded-2xl border border-gray-200/80 flex flex-col items-center w-full mx-auto shadow-md bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Acompanhe seu Atendimento</h3>
          <p className="text-gray-500 mb-4 text-sm max-w-xs">Escaneie o código com seu celular para ver os detalhes da sua triagem.</p>
          <div className="p-2 bg-white border rounded-lg">
             <QRCodeCanvas value={patientViewUrl} size={160} level={"H"} />
          </div>
          <p className="text-xs text-gray-500 mt-4 font-mono">Protocolo: {triage.protocol}</p>
      </div>
      
      {/* Contagem Regressiva e Botão */}
      <div className="mt-8">
         <p className="text-base text-gray-500 mb-3">
            Esta tela fechará automaticamente em <strong>{countdown}</strong> segundos...
         </p>
        <button
          onClick={onStartOver}
          className="px-10 py-3 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-lg shadow-md transition-all transform hover:scale-105"
        >
          Finalizar e Iniciar Nova Triagem
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;