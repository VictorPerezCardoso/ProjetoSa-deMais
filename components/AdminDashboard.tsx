import React, { useState } from 'react';
import { Attendant } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AdminDashboardProps {
  attendants: Attendant[];
  setAttendants: React.Dispatch<React.SetStateAction<Attendant[]>>;
  onExit: () => void;
}

// Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const AdminDashboard: React.FC<AdminDashboardProps> = ({ attendants, setAttendants, onExit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Attendant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openModalForNew = () => {
    setCurrentItem({ id: '', fullName: '', email: '', role: 'atendente' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openModalForEdit = (attendant: Attendant) => {
    setCurrentItem(attendant);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!currentItem || !currentItem.fullName.trim() || !currentItem.email.trim()) {
      alert("Nome e Email são obrigatórios.");
      return;
    }

    if (isEditing) {
      setAttendants(attendants.map(a => a.id === currentItem.id ? currentItem : a));
    } else {
      setAttendants([...attendants, { ...currentItem, id: uuidv4() }]);
    }
    setIsModalOpen(false);
    setCurrentItem(null);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este atendente?")) {
        setAttendants(attendants.filter(a => a.id !== id));
    }
  };
  
  const filteredAttendants = attendants.filter(a => a.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Atendente' : 'Novo Atendente'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" value={currentItem?.fullName || ''} onChange={(e) => setCurrentItem(prev => prev ? { ...prev, fullName: e.target.value } : null)} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={currentItem?.email || ''} onChange={(e) => setCurrentItem(prev => prev ? { ...prev, email: e.target.value } : null)} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <select value={currentItem?.role || 'atendente'} onChange={(e) => setCurrentItem(prev => prev ? { ...prev, role: e.target.value as 'atendente' | 'admin' } : null)} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="atendente">Atendente</option>
                <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
        </div>
      </div>
    </div>
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
                <button className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors bg-[#2E39C9] text-white">
                    <UsersIcon />
                    <span className="flex-1 font-semibold">Atendentes</span>
                    <span className="px-2 py-0.5 rounded-full text-sm font-bold bg-white text-[#2E39C9]">{attendants.length}</span>
                </button>
                {/* Other nav links can be added here */}
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
                <h2 className="text-2xl font-bold text-gray-800">Gestão de Atendentes</h2>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-xs">
                         <input type="text" placeholder="Buscar atendente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"/>
                         <div className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon/></div>
                    </div>
                    <button onClick={openModalForNew} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm whitespace-nowrap">
                        + Novo Atendente
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {filteredAttendants.map(attendant => (
                        <div key={attendant.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between transition-shadow hover:shadow-lg">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{attendant.fullName}</p>
                                    <p className="text-gray-500 text-sm">{attendant.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${attendant.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{attendant.role}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openModalForEdit(attendant)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><EditIcon/></button>
                                    <button onClick={() => handleDelete(attendant.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><DeleteIcon/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredAttendants.length === 0 && (
                         <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Nenhum atendente encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
        {isModalOpen && <Modal />}
    </div>
  );
};

export default AdminDashboard;
