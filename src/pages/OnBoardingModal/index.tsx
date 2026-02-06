import React, { useState, useEffect } from 'react';
import showToast from '../../utils/toast';
import { useUserData } from '../../hooks/useUserData';

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: (data: OnboardingData) => void;
}

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

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
    const { saveCompanyData, getUserId } = useUserData();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>({
        user: {
            name: '',
            email: '',
            phone: ''
        },
        company: {
            name: '',
            cnpj: '',
            phone: '',
            address: '',
            industry: 'outros'
        }
    });

    const industries = [
        'Tecnologia', 'Varejo', 'Serviços', 'Saúde', 'Educação',
        'Construção Civil', 'Indústria', 'Alimentício', 'Financeiro', 'Consultoria', 'Outros'
    ];

    const handleInputChange = (section: 'user' | 'company', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const formatCNPJ = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 14) {
            return numbers
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        }
        return value.substring(0, 18);
    };

    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }
        return value.substring(0, 15);
    };

    const handleNext = () => {
            if (step === 1) {
            if (!formData.user.name.trim() || !formData.user.email.trim()) {
                showToast('Por favor, preencha pelo menos o nome e e-mail do proprietário', 'error');
                return;
            }
            setStep(2);
        } else {
            if (!formData.company.name.trim() || !formData.company.cnpj.trim()) {
                showToast('Por favor, preencha pelo menos o nome e CNPJ da empresa', 'error');
                return;
            }
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            saveCompanyData(formData.company);
            
            const userDataKey = `user_${getUserId()}`;
            localStorage.setItem(userDataKey, JSON.stringify(formData.user));
            
            onComplete(formData);
            
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            showToast('Erro ao salvar dados. Tente novamente.', 'error');
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-lg max-h-[90vh] overflow-hidden">

                <div className="relative bg-gradient-to-r from-[#315aff] to-[#5b7cff] text-white p-4 sm:p-6 md:p-[27px] rounded-t-lg sm:rounded-t-xl">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                            {step === 1 ? 'Cadastro do Proprietário' : 'Cadastro da Empresa'}
                        </h1>
                        <p className="text-white/90 text-xs sm:text-sm">
                            {step === 1
                                ? 'Complete seu cadastro para acessar o sistema'
                                : 'Informe os dados da sua empresa'}
                        </p>
                    </div>

                    <div className="hidden sm:block absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm">
                        Etapa {step} de 2
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
                    <div className="flex items-center w-full max-w-sm sm:max-w-md">
                        <div className={`flex flex-col items-center ${step >= 1 ? 'text-[#315aff]' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1
                                ${step >= 1
                                    ? 'bg-[#315aff] text-white'
                                    : 'bg-gray-200 text-gray-400'}`}>
                                1
                            </div>
                            <span className="text-xs font-medium">Dados Pessoais</span>
                        </div>

                        <div className="flex-1 h-1 mx-2 sm:mx-4 bg-gray-200 relative">
                            <div className={`h-full ${step === 2 ? 'bg-[#315aff] w-full' : 'w-0'}`}></div>
                        </div>

                        <div className={`flex flex-col items-center ${step === 2 ? 'text-[#315aff]' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1
                                ${step === 2
                                    ? 'bg-[#315aff] text-white'
                                    : 'bg-gray-200 text-gray-400'}`}>
                                2
                            </div>
                            <span className="text-xs font-medium">Dados da Empresa</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.user.name}
                                    onChange={(e) => handleInputChange('user', 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                    placeholder="Digite seu nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    value={formData.user.email}
                                    onChange={(e) => handleInputChange('user', 'email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                    placeholder="exemplo@empresa.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.user.phone}
                                    onChange={(e) => handleInputChange('user', 'phone', formatPhone(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome da Empresa *
                                </label>
                                <input
                                    type="text"
                                    value={formData.company.name}
                                    onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                    placeholder="Digite o nome da empresa"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNPJ *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company.cnpj}
                                        onChange={(e) => handleInputChange('company', 'cnpj', formatCNPJ(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                        placeholder="00.000.000/0000-00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefone da Empresa
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.company.phone}
                                        onChange={(e) => handleInputChange('company', 'phone', formatPhone(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                        placeholder="(11) 3333-4444"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    value={formData.company.address}
                                    onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                    placeholder="Rua, número, bairro, cidade"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ramo de Atividade
                                </label>
                                <select
                                    value={formData.company.industry}
                                    onChange={(e) => handleInputChange('company', 'industry', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none bg-white text-sm sm:text-base"
                                >
                                    {industries.map((industry) => (
                                        <option key={industry} value={industry.toLowerCase()}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-4 sm:px-6 py-2 border border-[#315aff] text-[#315aff] font-medium rounded hover:bg-[#cddcff9a] transition-colors text-sm sm:text-base order-2 sm:order-1 cursor-pointer rounded-[6px]"
                            >
                                Voltar
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className={`px-4 sm:px-6 py-2 bg-[#315aff] hover:bg-[#5b7cff] text-white font-medium rounded-[6px] transition-colors text-sm cursor-pointer sm:text-base ${step === 1 ? 'w-full' : 'w-full sm:w-auto order-1 sm:order-2 '}`}
                        >
                            {step === 1 ? 'Continuar para Dados da Empresa' : 'Concluir Cadastro'}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-xs mt-2 sm:mt-3">
                        {step === 1
                            ? 'Todos os campos marcados com * são obrigatórios'
                            : 'Após concluir, o sistema estará pronto para uso'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;