import React from 'react';
import { AppScreen } from '../types';

interface HomePageProps {
  setScreen: (screen: AppScreen) => void;
}

// FIX: Add IconProps interface and update icon components to accept a className prop.
interface IconProps {
  className?: string;
}

const SmartphoneIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const UsersIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ShieldIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const QrCodeIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>;
const ArrowRightIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const CheckIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>;

const HomePage: React.FC<HomePageProps> = ({ setScreen }) => {

  const panels = [
    {
      screen: 'TOTEM_WELCOME' as AppScreen,
      icon: SmartphoneIcon,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "TOTEM",
      description: "Triagem inicial do paciente com IA conversacional",
    },
    {
      screen: 'ATTENDANT_DASHBOARD' as AppScreen,
      icon: UsersIcon,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Atendente",
      description: "Gerenciar fila, salas e relatórios do dia",
    },
    {
      screen: 'ADMIN_DASHBOARD' as AppScreen,
      icon: ShieldIcon,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Administrador",
      description: "Controlar atendentes, salas e estatísticas",
    },
    {
      screen: 'PATIENT_VIEW' as AppScreen,
      icon: QrCodeIcon,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Portal Paciente",
      description: "Visualizar dados via QR Code",
    },
  ];

  const features = [
      { title: 'Triagem com IA', description: 'Avaliação inteligente de sintomas com determinação de nível de risco' },
      { title: 'Prioridade por Risco', description: 'Fila ordenada por nível de risco e idade (idosos prioritários)' },
      { title: 'Voz e Microfone', description: 'IA fala com o paciente e aceita entrada de voz' },
      { title: 'QR Code', description: 'Pacientes acessam dados via QR Code gerado na triagem' },
      { title: 'Relatórios', description: 'Estatísticas e relatórios em PDF (dia/semana/mês)' },
      { title: 'Gerenciamento', description: 'Controle completo de atendentes, salas e consultas' },
  ];

  return (
    <div className="font-inter animate-fade-in">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E39C9] to-[#1E2A99] rounded-lg flex items-center justify-center text-white font-poppins font-bold text-lg">SM</div>
            <h1 className="text-2xl font-poppins font-bold text-[#2E39C9]">Saúde Mais</h1>
          </div>
          <p className="text-gray-600 font-inter hidden md:block border border-gray-300 px-3 py-1 rounded-full text-sm">
            Sistema de Triagem Inteligente
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1E2559] mb-4">
            Sistema de Triagem Inteligente
          </h2>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            Otimizando o atendimento em hospitais e UPAs com inteligência artificial
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <button key={panel.screen} onClick={() => setScreen(panel.screen)} className="text-left">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
                  <div className={`w-12 h-12 ${panel.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:opacity-80 transition-opacity`}>
                    <Icon className={panel.iconColor} />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-[#1E2559] mb-2">
                    {panel.title}
                  </h3>
                  <p className="text-gray-600 font-inter text-sm mb-4 flex-grow">
                    {panel.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#2E39C9] font-inter font-semibold text-sm group-hover:gap-3 transition-all">
                    Acessar <ArrowRightIcon />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h3 className="text-3xl font-poppins font-bold text-[#1E2559] mb-10 text-center">
            Funcionalidades Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {features.map(feature => (
                <div key={feature.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#2E39C9] flex items-center justify-center text-white flex-shrink-0 mt-1">
                        <CheckIcon />
                    </div>
                    <div>
                        <h4 className="font-poppins font-semibold text-lg text-[#1E2559] mb-1">{feature.title}</h4>
                        <p className="text-gray-600 font-inter text-sm">{feature.description}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#2E39C9] to-[#1E2A99] rounded-2xl shadow-lg p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-poppins font-bold mb-4">Pronto para Começar?</h3>
          <p className="font-inter mb-8 max-w-2xl mx-auto">
            Clique em uma das opções acima para acessar o sistema desejado
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setScreen('TOTEM_WELCOME')}
              className="px-8 py-3 bg-white text-[#2E39C9] rounded-lg font-poppins font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Iniciar Triagem
            </button>
            <button
              onClick={() => setScreen('ATTENDANT_DASHBOARD')}
              className="px-8 py-3 border-2 border-white/80 text-white rounded-lg font-poppins font-semibold hover:bg-white/10 transition-colors inline-block"
            >
              Painel Atendente
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 font-inter text-sm">
            Saúde Mais © {new Date().getFullYear()} - Sistema de Triagem Inteligente para Hospitais e UPAs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;