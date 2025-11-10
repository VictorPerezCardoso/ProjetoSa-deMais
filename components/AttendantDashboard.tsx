import React, { useState, useMemo } from 'react';
import { Patient, Triage } from '../types';
import { RISK_PROFILES } from '../constants';

interface AttendantDashboardProps {
  patients: Patient[];
  triages: Triage[];
  onExit: () => void;
}

type Tab = 'fila' | 'salas' | 'relatorios';

const QueueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const RoomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const AttendantDashboard: React.FC<AttendantDashboardProps> = ({ patients, triages, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('fila');
  const [searchTerm, setSearchTerm] = useState('');

  const waitingList = useMemo(() => {
    return triages
      .filter(t => t.status === 'aguardando')
      .map(triage => {
        const patient = patients.find(p => p.id === triage.patientId);
        return { ...triage, patient };
      })
      .filter(item => item.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || item.protocol.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const riskOrder: Record<string, number> = { vermelho: 1, laranja: 2, amarelo: 3, verde: 4, indefinido: 5 };
        if (a.patient?.isPriority && !b.patient?.isPriority) return -1;
        if (!a.patient?.isPriority && b.patient?.isPriority) return 1;
        if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [triages, patients, searchTerm]);


  // FIX: Changed JSX.Element to React.ReactElement to fix "Cannot find namespace 'JSX'" error.
  const NavLink: React.FC<{tab: Tab, icon: React.ReactElement, text: string, count?: number}> = ({tab, icon, text, count}) => (
    <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-[#2E39C9] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        {icon}
        <span className="flex-1 font-semibold">{text}</span>
        {count !== undefined && <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${activeTab === tab ? 'bg-white text-[#2E39C9]' : 'bg-gray-200 text-gray-700'}`}>{count}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
        {/* Sidebar */}
        <aside className="w-64 bg-white flex flex-col border-r border-gray-200">
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E39C9] to-[#1E2A99] rounded-lg flex items-center justify-center text-white font-poppins font-bold text-lg">SM</div>
                <h1 className="text-xl font-poppins font-bold text-[#2E39C9]">Saúde Mais</h1>
            </div>
            <nav className="p-4 space-y-2 flex-1">
                <NavLink tab="fila" icon={<QueueIcon/>} text="Fila de Espera" count={waitingList.length}/>
                <NavLink tab="salas" icon={<RoomIcon/>} text="Salas"/>
                <NavLink tab="relatorios" icon={<ReportIcon/>} text="Relatórios"/>
            </nav>
            <div className="p-4 border-t border-gray-200">
                 <button onClick={onExit} className="w-full px-4 py-2 text-sm text-center font-semibold rounded-lg transition-colors bg-transparent text-gray-600 hover:bg-gray-200">
                    Sair
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    {activeTab === 'fila' ? 'Fila de Espera' : activeTab}
                </h2>
                <div className="relative w-full max-w-sm">
                    <input 
                        type="text" 
                        placeholder="Buscar paciente..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <SearchIcon/>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'fila' && (
                <div className="space-y-4">
                    {waitingList.length > 0 ? waitingList.map(item => {
                        const riskProfile = RISK_PROFILES[item.riskLevel] || RISK_PROFILES.indefinido;
                        return (
                            <div key={item.id} className="bg-white p-5 rounded-xl shadow-md transition-shadow hover:shadow-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1 mb-4 sm:mb-0">
                                        <div className="flex items-center gap-4 mb-2">
                                            <p className="text-3xl font-bold text-gray-700">{item.password}</p>
                                            <div>
                                                <p className="font-bold text-xl text-gray-800">{item.patient?.fullName}</p>
                                                <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                                                    <span>Idade: {item.patient?.age}</span>
                                                    <span>Protocolo: {item.protocol}</span>
                                                    <span>Telefone: {item.patient?.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">Sintomas: {item.summary}</p>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                                       <div className={`px-3 py-1 text-xs font-bold rounded-full ${riskProfile.bgColorClass} ${riskProfile.colorClass}`}>{riskProfile.name}</div>
                                       <button className="px-6 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg w-full sm:w-auto hover:bg-indigo-200 transition-colors">Chamar</button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">A fila de espera está vazia.</p>
                        </div>
                    )}
                </div>
              )}
               {/* Placeholder for other tabs */}
               {activeTab !== 'fila' && (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Seção de <span className="font-bold">{activeTab}</span> em desenvolvimento.</p>
                </div>
               )}
            </div>
        </main>
    </div>
  );
};

export default AttendantDashboard;