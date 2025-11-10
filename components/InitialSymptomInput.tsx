import React, { useState, useEffect, useRef } from 'react';

interface InitialSymptomInputProps {
  onSubmit: (symptom: string) => void;
}

const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const InitialSymptomInput: React.FC<InitialSymptomInputProps> = ({ onSubmit }) => {
  const [symptom, setSymptom] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => setSymptom(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setError('Houve um erro com o microfone. Por favor, digite.');
      setIsListening(false);
    }
    recognitionRef.current = recognition;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Obrigado! Agora, por favor, descreva o que está sentindo. Você pode digitar ou clicar no microfone para falar.');
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  }, []);
  
  const startListening = () => {
    if (isListening || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch(e) {
      console.error("Erro ao iniciar reconhecimento de voz:", e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) {
      setError('Por favor, descreva o que você está sentindo.');
      return;
    }
    setError('');
    window.speechSynthesis.cancel();
    onSubmit(symptom);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in">
        <header className="text-center mb-6">
            <h1 className="text-5xl font-poppins font-bold text-[#1E2559]">Saúde Mais</h1>
            <p className="text-lg text-gray-600 font-inter">Sistema de Triagem Inteligente</p>
        </header>

        <div className="bg-gray-100 rounded-lg p-4 my-6 min-h-[60px] flex items-center justify-center text-center">
            <p className="text-blue-800 font-semibold text-lg">Obrigado! Agora, por favor, descreva o que está sentindo. Você pode digitar ou clicar no microfone para falar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="symptom" className="sr-only">Descreva seus sintomas...</label>
              <textarea
                id="symptom"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                placeholder="Descreva seus sintomas..."
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-grow flex items-center justify-center gap-3 px-6 py-4 bg-[#2E39C9] text-white text-xl font-bold rounded-lg shadow-md hover:bg-[#1E2A99] transition-colors"
                >
                  <SendIcon />
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={startListening}
                  disabled={isListening}
                  className={`w-full sm:w-auto flex-grow flex items-center justify-center gap-3 px-6 py-4 ${isListening ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'} text-white text-xl font-bold rounded-lg shadow-md transition-colors`}
                  aria-label="Falar sintoma"
                >
                  <MicrophoneIcon isListening={isListening} />
                  {isListening ? 'Ouvindo...' : 'Falar'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default InitialSymptomInput;