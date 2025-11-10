import React, { useState, useEffect, useRef } from 'react';

interface RegistrationFormProps {
  onSubmit: (data: { fullName: string; age: number; phone: string }) => void;
}

const MicrophoneIcon: React.FC<{ isListening: boolean, className?: string }> = ({ isListening, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 group-hover:text-green-600'} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningFor, setListeningFor] = useState<'name' | 'phone' | null>(null);

  const recognitionRef = useRef<any | null>(null);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      if (listeningFor === 'name') {
        setFullName(transcript);
      } else if (listeningFor === 'phone') {
        setPhone(transcript.replace(/\D/g, ''));
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningFor(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
      setListeningFor(null);
    }
    
    recognitionRef.current = recognition;
    
    const timer = setTimeout(() => {
      speak('Olá! Bem-vindo ao sistema de triagem inteligente. Por favor, digite seu nome completo.');
    }, 150);

    return () => {
      clearTimeout(timer);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleListen = (field: 'name' | 'phone') => {
    if (isListening || !recognitionRef.current) return;
    
    setListeningFor(field);
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Could not start recognition:", e);
      setIsListening(false);
      setListeningFor(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && age.trim() && phone.trim().length >= 10) {
      onSubmit({ fullName, age: parseInt(age), phone });
    } else {
      alert("Por favor, preencha todos os campos corretamente.");
    }
  };

  const renderInput = (
    id: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type: string = 'text',
    listenField?: 'name' | 'phone'
  ) => (
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {listenField && (
        <button
          type="button"
          onClick={() => handleListen(listenField)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 group"
          aria-label={`Ditar ${placeholder}`}
        >
          <MicrophoneIcon isListening={isListening && listeningFor === listenField} className="text-green-500 group-hover:text-green-600" />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in">
      <header className="text-center mb-6">
        <h1 className="text-5xl font-poppins font-bold text-[#1E2559]">Saúde Mais</h1>
        <p className="text-lg text-gray-600 font-inter">Sistema de Triagem Inteligente</p>
      </header>
      
      <div className="bg-gray-100 rounded-lg p-4 my-6 min-h-[60px] flex items-center justify-center text-center">
        <p className="text-blue-800 font-semibold text-lg">Olá! Bem-vindo ao sistema de triagem inteligente. Por favor, digite seu nome completo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInput("fullName", "Nome completo", fullName, (e) => setFullName(e.target.value), 'text', 'name')}
        {renderInput("age", "Idade", age, (e) => setAge(e.target.value.replace(/\D/g, '')), 'number')}
        {renderInput("phone", "Telefone", phone, (e) => setPhone(e.target.value.replace(/\D/g, '')), 'tel', 'phone')}
        
        <button
          type="submit"
          className="w-full mt-4 px-8 py-5 bg-[#2E39C9] text-white text-2xl font-bold rounded-lg hover:bg-[#1E2A99] focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          Próximo
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;