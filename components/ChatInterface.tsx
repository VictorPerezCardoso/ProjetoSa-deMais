import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Patient, AITriageResult, ChatMessage } from '../types';
import { getAISystemInstruction } from '../constants';

// Icons
const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isListening ? 'text-red-500 animate-pulse' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

interface ChatInterfaceProps {
  patient: Patient;
  initialSymptom: string;
  onComplete: (result: AITriageResult, chatHistory: ChatMessage[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ patient, initialSymptom, onComplete }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    
    const chatRef = useRef<Chat | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    };

    const addMessage = (sender: 'user' | 'ia', text: string) => {
        setMessages(prev => [...prev, {id: Date.now(), sender, text}]);
    }

    const processAIResponse = useCallback((responseText: string) => {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const jsonString = jsonMatch[0];
            try {
                const result: AITriageResult = JSON.parse(jsonString);
                const conversationalPart = responseText.replace(jsonString, '').trim();
                
                const finalHistory = [...messages];
                if (conversationalPart) {
                    const newMessage = {id: Date.now(), sender: 'ia' as const, text: conversationalPart};
                    finalHistory.push(newMessage);
                    // Update UI and speak before navigating away
                    setMessages(prev => [...prev, newMessage]);
                    speak(conversationalPart);
                }
                
                onComplete(result, finalHistory);
                return;
            } catch (e) {
                console.error("Erro ao parsear JSON da IA, tratando como texto normal.", e);
            }
        }
        addMessage('ia', responseText);
        speak(responseText);
    }, [onComplete, messages]);

    const startChat = useCallback(async () => {
        try {
            // FIX: Initialize GoogleGenAI with an object containing the apiKey.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const systemInstruction = getAISystemInstruction(patient, initialSymptom);
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            chatRef.current = chat;
            
            // FIX: Pass an object with a 'message' property to chat.sendMessage.
            const response = await chat.sendMessage({ message: `Comece a triagem para o sintoma: "${initialSymptom}"` });
            
            setIsLoading(false);
            processAIResponse(response.text);

        } catch (error) {
            console.error("Falha ao iniciar o chat com a IA:", error);
            setIsLoading(false);
            let friendlyMessage = "Desculpe, não consegui me conectar. Por favor, aguarde um atendente.";
            const errorString = JSON.stringify(error).toLowerCase();
            if (errorString.includes('429') || errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                friendlyMessage = "O sistema de triagem está temporariamente sobrecarregado. Por favor, dirija-se a um atendente para continuar.";
            }
            addMessage('ia', friendlyMessage);
        }
    }, [patient, initialSymptom, processAIResponse]);


    useEffect(() => {
        startChat();
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.onresult = (event: any) => setUserInput(event.results[0][0].transcript);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
    }, [startChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleListen = () => {
        if(isListening || !recognitionRef.current) return;
        setUserInput('');
        setIsListening(true);
        recognitionRef.current.start();
    }

    const handleSend = async () => {
        if (!userInput.trim() || isLoading || !chatRef.current) return;

        addMessage('user', userInput);
        const textToSend = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: textToSend });
            processAIResponse(response.text);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            let friendlyMessage = "Ocorreu um erro ao processar sua resposta. Por favor, aguarde um atendente.";
            const errorString = JSON.stringify(error).toLowerCase();
            if (errorString.includes('429') || errorString.includes('quota') || errorString.includes('resource_exhausted')) {
                friendlyMessage = "O sistema de triagem está temporariamente sobrecarregado. Por favor, dirija-se a um atendente para continuar.";
            }
            addMessage('ia', friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[900px]">
             <div className="p-6 border-b border-gray-200 text-center">
                <h2 className="text-3xl font-poppins font-bold text-gray-800">Assistente Virtual</h2>
                <p className="text-lg text-gray-500 mt-1">Responda as perguntas para continuar.</p>
            </div>
            <div className="flex-grow bg-gray-100 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         {msg.sender === 'ia' && <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">IA</div>}
                        <div className={`max-w-lg px-5 py-3 rounded-2xl shadow-md text-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && messages.length > 0 && (
                     <div className="flex items-end gap-2 justify-start">
                         <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">IA</div>
                         <div className="px-5 py-3 rounded-2xl shadow-md bg-white text-gray-900 rounded-bl-none">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex gap-4 items-center rounded-b-2xl">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Digite sua resposta aqui..."
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-gray-100 border-2 border-transparent rounded-full text-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                 <button
                    onClick={handleListen}
                    disabled={isLoading || isListening}
                    className="p-5 rounded-full bg-green-600 hover:bg-green-700 transition-colors flex-shrink-0"
                >
                    <MicrophoneIcon isListening={isListening} />
                </button>
                <button
                    onClick={handleSend}
                    disabled={isLoading || !userInput.trim()}
                    className="p-5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;