import React, { useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {

  useEffect(() => {
    // Pré-carrega as vozes da síntese de fala
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center animate-fade-in">
        <h1 className="text-5xl font-poppins font-bold text-[#1E2559]">Saúde Mais</h1>
        <p className="text-lg text-gray-600 font-inter mb-8">Sistema de Triagem Inteligente</p>
        
        <div className="my-8">
          <h2 className="text-4xl font-poppins font-semibold text-gray-800 mb-3">Bem-vindo!</h2>
          <p className="text-gray-600 font-inter text-xl">Clique no botão abaixo para iniciar o processo de triagem.</p>
        </div>
        
        <button
          onClick={onStart}
          className="w-full px-8 py-5 bg-[#2E39C9] text-white text-2xl font-bold rounded-lg shadow-lg hover:bg-[#1E2A99] focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
        >
          INICIAR
        </button>
    </div>
  );
};

export default WelcomeScreen;