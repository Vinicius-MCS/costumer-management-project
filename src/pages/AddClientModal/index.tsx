import React, { useState } from 'react';

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

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddClient: (client: Omit<ClientData, 'id' | 'registrationDate'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAddClient }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: '',
        birthDate: '',
        status: 'ativo' as 'ativo' | 'inativo' | 'pendente'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = [
        { value: 'ativo', label: 'Ativo' },
        { value: 'inativo', label: 'Inativo' },
        { value: 'pendente', label: 'Pendente' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (name === 'phone') {
            formattedValue = formatPhone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const formatCPF = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return value.substring(0, 14);
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

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (formData.cpf && !cpfRegex.test(formData.cpf)) {
            newErrors.cpf = 'CPF inválido (formato: 123.456.789-00)';
        }

        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            newErrors.phone = 'Telefone inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onAddClient(formData);

        setFormData({
            name: '',
            email: '',
            phone: '',
            cpf: '',
            address: '',
            birthDate: '',
            status: 'ativo'
        });
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            cpf: '',
            address: '',
            birthDate: '',
            status: 'ativo'
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 max-h-[90vh] overflow-hidden">
                
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#315aff] to-[#5b7cff] text-white p-4 sm:p-6 rounded-t-lg sm:rounded-t-xl">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center h-[35px]">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Adicionar Novo Cliente</h1>
                            <button
                                onClick={handleClose}
                                className="text-white text-[30px] hover:text-gray-200 transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-white/90 text-xs sm:text-sm">
                            Preencha os dados do cliente para cadastrar
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3 sm:space-y-4">
                        {/* Nome Completo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base`}
                                placeholder="Digite o nome completo do cliente"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* E-mail e Telefone lado a lado em desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* E-mail */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base`}
                                    placeholder="cliente@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base`}
                                    placeholder="(11) 99999-9999"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* CPF e Data de Nascimento lado a lado em desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* CPF */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CPF *
                                </label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.cpf ? 'border-red-500' : 'border-gray-300'} rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base`}
                                    placeholder="123.456.789-00"
                                />
                                {errors.cpf && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                                )}
                            </div>

                            {/* Data de Nascimento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Endereço */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none text-sm sm:text-base"
                                placeholder="Rua, número, bairro, cidade"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status do Cliente
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#315aff] focus:ring-1 focus:ring-[#315aff] outline-none bg-white text-sm sm:text-base"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer com Botões */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1 rounded-[6px] cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 sm:px-6 py-2 bg-[#315aff] hover:bg-[#5b7cff] text-white font-medium rounded-[6px] transition-colors text-sm sm:text-base order-1 sm:order-2 cursor-pointer"
                        >
                            Adicionar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;