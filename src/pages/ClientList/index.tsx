import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import icone_perfil from '../../assets/images/icone-perfil.png';
import icone_sair from '../../assets/images/icone-sair.png';
import icone_perfil_cinza from '../../assets/images/icone-perfil-cinza.png';
import OnboardingModal from '../OnBoardingModal';
import AddClientModal from '../AddClientModal';
import showToast from '../../utils/toast';

interface OnboardingData {
    user: {
        name: string;
        email: string;
        phone: string;
    };
    company: {
        name: string;
        cnpj: string;
        phone: string;
        address: string;
        industry: string;
    };
}

interface ClientData {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    address?: string;
    birthDate?: string;
    status: 'ativo' | 'inativo' | 'pendente';
    registrationDate: string;
}

export const ClientList = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [clients, setClients] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getUserId = (): string | null => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                return user.id || user.userId || user.email || null;
            } catch (error) {
                console.error('Erro ao parsear currentUser:', error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        const loadUserData = () => {
            const userId = getUserId();

            if (!userId) {
                navigate('/');
                setLoading(false);
                return;
            }

            const userKey = `user_${userId}`;
            const companyKey = `company_${userId}`;
            const onboardingKey = `onboarding_${userId}`;
            const clientsKey = `clients_${userId}`;

            const storedUser = localStorage.getItem(userKey);
            if (storedUser) {
                try {
                    setUserData(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Erro ao parsear userData:', error);
                }
            }

            const storedCompany = localStorage.getItem(companyKey);
            if (storedCompany) {
                try {
                    setCompanyData(JSON.parse(storedCompany));
                } catch (error) {
                    console.error('Erro ao parsear companyData:', error);
                }
            }

            const storedClients = localStorage.getItem(clientsKey);
            if (storedClients) {
                try {
                    setClients(JSON.parse(storedClients));
                } catch (error) {
                    console.error('Erro ao parsear clients:', error);
                }
            }

            const hasOnboarding = localStorage.getItem(onboardingKey);
            if (!hasOnboarding || hasOnboarding !== 'true') {
                setTimeout(() => {
                    setShowOnboarding(true);
                }, 500);
            }

            setLoading(false);
        };

        loadUserData();
    }, [navigate]);

    useEffect(() => {
        const userId = getUserId();
        if (!userId || clients.length === 0) return;

        const clientsKey = `clients_${userId}`;
        localStorage.setItem(clientsKey, JSON.stringify(clients));
    }, [clients]);

    const handleOnboardingComplete = (data: OnboardingData) => {
        const userId = getUserId();
        if (!userId) {
            showToast('Erro: Usuário não identificado. Faça login novamente.', 'error');
            navigate('/');
            return;
        }

        const userKey = `user_${userId}`;
        const companyKey = `company_${userId}`;
        const onboardingKey = `onboarding_${userId}`;

        localStorage.setItem(userKey, JSON.stringify(data.user));
        localStorage.setItem(companyKey, JSON.stringify(data.company));
        localStorage.setItem(onboardingKey, 'true');

        setUserData(data.user);
        setCompanyData(data.company);
        setShowOnboarding(false);

        window.location.reload();
    };

    const handleAddClient = (clientData: Omit<ClientData, 'id' | 'registrationDate'>) => {
        const userId = getUserId();
        if (!userId) {
            showToast('Erro: Usuário não identificado. Faça login novamente.', 'error');
            navigate('/');
            return;
        }

        const newClient: ClientData = {
            ...clientData,
            id: Date.now().toString(),
            registrationDate: new Date().toLocaleDateString('pt-BR')
        };

        const updatedClients = [...clients, newClient];
        setClients(updatedClients);

        const clientsKey = `clients_${userId}`;
        localStorage.setItem(clientsKey, JSON.stringify(updatedClients));
    };

    const handleDeleteClient = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            const userId = getUserId();
            if (!userId) return;

            const updatedClients = clients.filter(client => client.id !== id);
            setClients(updatedClients);

            const clientsKey = `clients_${userId}`;
            localStorage.setItem(clientsKey, JSON.stringify(updatedClients));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('userSession');

        navigate('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'bg-green-100 text-green-800';
            case 'inativo':
                return 'bg-red-100 text-red-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ativo': return 'Ativo';
            case 'inativo': return 'Inativo';
            case 'pendente': return 'Pendente';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className='bg-[#cddcff9a] min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-16 h-16 border-4 border-[#315aff] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600 font-medium'>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#cddcff9a] min-h-screen'>
            <OnboardingModal
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
            />

            <AddClientModal
                isOpen={showAddClientModal}
                onClose={() => setShowAddClientModal(false)}
                onAddClient={handleAddClient}
            />

            <header className='flex flex-row items-center justify-between bg-white px-4 sm:px-[15px] py-[16px] sm:py-[22px] shadow-sm shadow-[#a5a5a5] sticky top-0 z-10'>
                <div className='flex justify-start items-center gap-[8px] w-full'>
                    <img src={icone_perfil} alt="Ícone de perfil" className='h-10 sm:h-[50px] ml-[5px]' />
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-[18px] sm:text-[20px] leading-[23px]'>
                            Gestão de Clientes
                        </h1>
                        <p className='text-gray-700 text-[15px] sm:text-[16px]'>
                            {userData ? `Olá, ${userData.name}` : 'Olá'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className='bg-[#f4f4f4] w-[50px] sm:w-[70px] h-[36px] sm:h-[30px] text-[15px] font-semibold border-[1px] border-[#c1c0c0] rounded-[4px] cursor-pointer shadow-sm shadow-[#a6a6a6] hover:bg-[#dee8fc] transition-colors duration-300 flex justify-center items-center gap-[7px] '
                >
                    <img src={icone_sair} alt="Ícone de saída" className='h-[15px]' />
                    <span className='hidden sm:inline'>Sair</span>
                </button>
            </header>

            <main className='flex flex-col py-[12px] px-4 sm:px-[20px] max-w-7xl mx-auto'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between my-[8px] mx-0 sm:mx-[12px] gap-3 w-full'>
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-[23px] text-gray-800'>
                            {companyData ? `Clientes - ${companyData.name}` : 'Meus Clientes'}
                        </h1>
                        <p className='text-gray-700 text-[17px]'>
                            {clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddClientModal(true)}
                        className='bg-[#315aff] hover:bg-[#5b7cff] h-[40px] w-full sm:w-[180px] cursor-pointer transition-colors duration-200 rounded-[6px] text-white font-medium flex items-center justify-center gap-2'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Adicionar Cliente</span>
                    </button>
                </div>

                {clients.length === 0 ? (
                    <div className='flex flex-col justify-center items-center bg-white w-full rounded-[10px] h-auto sm:h-[380px] mt-[12px] gap-[12px] p-6 shadow-sm'>
                        <img src={icone_perfil_cinza} alt="Ícone de perfil cinza" className='h-[70px] mb-[8px]' />
                        <p className='font-semibold text-[20px] leading-[20px] text-gray-800'>Nenhum cliente cadastrado</p>
                        <p className='text-gray-600 text-[16px] mb-[10px] text-center max-w-md'>
                            Comece adicionando seu primeiro cliente
                        </p>
                        <button
                            onClick={() => setShowAddClientModal(true)}
                            className='bg-[#315aff] hover:bg-[#5b7cff] h-[40px] w-full sm:w-[250px] cursor-pointer transition-colors duration-200 rounded-[6px] text-white font-medium flex items-center justify-center gap-2'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Adicionar primeiro cliente</span>
                        </button>
                    </div>
                ) : (
                    <div className='bg-white rounded-[10px] mt-[12px] overflow-hidden shadow-sm'>
                        <div className='hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-gray-700'>
                            <div className='col-span-4'>Nome</div>
                            <div className='col-span-3'>Contato</div>
                            <div className='col-span-2'>CPF</div>
                            <div className='col-span-2'>Status</div>
                            <div className='col-span-1 text-center'>Ações</div>
                        </div>

                        <div className='divide-y divide-gray-100 max-h-[500px] overflow-y-auto'>
                            {clients.map((client) => (
                                <div key={client.id} className='grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors'>
                                    <div className='sm:col-span-4 flex items-center'>
                                        <div className='w-10 h-10 rounded-full bg-[#315aff]/10 flex items-center justify-center text-[#315aff] font-bold mr-3 flex-shrink-0'>
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='font-medium text-gray-800 truncate'>{client.name}</p>
                                            {client.birthDate && (
                                                <p className='text-sm text-gray-500'>Nasc: {client.birthDate}</p>
                                            )}
                                            {client.address && (
                                                <p className='text-xs text-gray-400 truncate' title={client.address}>
                                                    {client.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='sm:col-span-3 min-w-0'>
                                        <p className='font-medium text-gray-800 truncate' title={client.email}>
                                            {client.email}
                                        </p>
                                        <p className='text-sm text-gray-500'>{client.phone}</p>
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <p className='font-medium text-gray-800'>{client.cpf}</p>
                                        <p className='text-sm text-gray-500'>
                                            Cadastrado em: {client.registrationDate}
                                        </p>
                                    </div>

                                    <div className='sm:col-span-2'>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                            {getStatusText(client.status)}
                                        </span>
                                    </div>

                                    <div className='sm:col-span-1 flex items-center justify-center'>
                                        <button
                                            onClick={() => handleDeleteClient(client.id)}
                                            className='text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded cursor-pointer'
                                            title="Excluir cliente"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='p-4 border-t border-gray-200 bg-gray-50'>
                            <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                                <p className='text-gray-600'>
                                    Mostrando {clients.length} cliente{clients.length !== 1 ? 's' : ''}
                                </p>
                                <div className='flex flex-wrap gap-2 justify-center'>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('ativo')}`}>
                                        ✅ Ativos: {clients.filter(c => c.status === 'ativo').length}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('inativo')}`}>
                                        ⏸️ Inativos: {clients.filter(c => c.status === 'inativo').length}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('pendente')}`}>
                                        ⏳ Pendentes: {clients.filter(c => c.status === 'pendente').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {companyData && (
                    <div className='mt-[50px] mb-[20px] bg-white rounded-[10px] p-6 shadow-sm'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='font-bold text-[20px] text-gray-800'>Informações da Empresa</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-gray-600 text-sm mb-1'>Nome da Empresa</p>
                                    <p className='font-medium text-gray-800'>{companyData.name}</p>
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm mb-1'>CNPJ</p>
                                    <p className='font-medium text-gray-800'>{companyData.cnpj}</p>
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm mb-1'>Telefone</p>
                                    <p className='font-medium text-gray-800'>{companyData.phone || 'Não informado'}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-gray-600 text-sm mb-1'>Ramo de Atividade</p>
                                    <p className='font-medium text-gray-800 capitalize'>{companyData.industry}</p>
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm mb-1'>E-mail do Proprietário</p>
                                    <p className='font-medium text-gray-800'>{userData?.email || 'Não informado'}</p>
                                </div>
                                {companyData.address && (
                                    <div>
                                        <p className='text-gray-600 text-sm mb-1'>Endereço</p>
                                        <p className='font-medium text-gray-800'>{companyData.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className='mt-[30px] mb-[20px] text-center text-gray-500 text-sm'>
                    <p>© {new Date().getFullYear()} Sistema de Gestão de Clientes - Grupo 7</p>
                    <p className='mt-1'>Total de clientes armazenados: {clients.length}</p>
                    {userData && (
                        <p className='mt-1 text-xs'>
                            Usuário: {userData.email} • Último acesso: {new Date().toLocaleDateString('pt-BR')}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};