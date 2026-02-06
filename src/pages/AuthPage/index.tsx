import { useState } from "react";
import showToast from '../../utils/toast';
import logo from '../../assets/images/logo.png';
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        login: {
            email: '',
            password: ''
        },
        cadastro: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
    const [errors, setErrors] = useState({
        login: {} as Record<string, string>,
        cadastro: {} as Record<string, string>
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleInputChange = (tab: 'login' | 'cadastro', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                [field]: value
            }
        }));

        if (errors[tab][field]) {
            setErrors(prev => ({
                ...prev,
                [tab]: {
                    ...prev[tab],
                    [field]: ''
                }
            }));
        }
    };

    const validateLoginForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.login.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.login.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.login.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (!validatePassword(formData.login.password)) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        setErrors(prev => ({ ...prev, login: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const validateCadastroForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.cadastro.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.cadastro.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.cadastro.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (!validatePassword(formData.cadastro.password)) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (!formData.cadastro.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.cadastro.password !== formData.cadastro.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        setErrors(prev => ({ ...prev, cadastro: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateLoginForm()) return;
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u: any) =>
                u.email === formData.login.email && u.password === formData.login.password
            );

            if (user) {
                const userData = {
                    ...user,
                    userId: user.id || user.email,
                    lastLogin: new Date().toISOString()
                };

                localStorage.setItem('currentUser', JSON.stringify(userData));
                sessionStorage.setItem('userSession', JSON.stringify({
                    userId: userData.userId,
                    email: userData.email,
                    timestamp: Date.now()
                }));

                navigate("/clientlist");
            } else {
                setErrors(prev => ({
                    ...prev,
                    login: { ...prev.login, general: 'Email ou senha incorretos' }
                }));
            }
        } catch (error) {
            console.error('Erro no login:', error);
            setErrors(prev => ({
                ...prev,
                login: { ...prev.login, general: 'Erro ao fazer login' }
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleCadastro = async () => {
        if (!validateCadastroForm()) return;
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const emailExists = users.some((u: any) => u.email === formData.cadastro.email);

            if (emailExists) {
                setErrors(prev => ({
                    ...prev,
                    cadastro: { ...prev.cadastro, email: 'Este email já está cadastrado' }
                }));
                return;
            }

            const userId = btoa(formData.cadastro.email);

            const newUser = {
                id: userId,
                email: formData.cadastro.email,
                password: formData.cadastro.password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            localStorage.setItem('currentUser', JSON.stringify({
                ...newUser,
                userId: userId
            }));

            sessionStorage.setItem('userSession', JSON.stringify({
                userId: userId,
                email: newUser.email,
                timestamp: Date.now()
            }));

            localStorage.removeItem('hasCompletedOnboarding');
            localStorage.removeItem('companyData');
            localStorage.removeItem('userData');

            showToast('Cadastro realizado com sucesso! Complete o cadastro da empresa.', 'success');
            navigate("/clientlist");

        } catch (error) {
            console.error('Erro no cadastro:', error);
            setErrors(prev => ({
                ...prev,
                cadastro: { ...prev.cadastro, general: 'Erro ao criar conta' }
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setErrors({
            login: {},
            cadastro: {}
        });
    };

    return (
        <main className='bg-[#cddcff9a] flex justify-center items-center min-h-screen py-4 sm:py-[30px] px-4'>
            <div className='bg-white flex flex-col justify-center h-auto min-h-[400px] w-full max-w-[450px] items-center rounded-2xl p-4 sm:p-8 md:p-10'>
                <div className='flex flex-col items-center mb-4 sm:mb-5'>
                    <img src={logo} alt="Logo" className='h-12 sm:h-[60px] md:h-[70px] mb-2 sm:mb-[10px]' />
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-center'>Sistema de Gestão</h1>
                    <h2 className='text-xs sm:text-sm md:text-base text-gray-600 font-medium mt-1 sm:mt-2 text-center'>
                        {activeTab === 'login'
                            ? 'Faça login para acessar o painel de clientes'
                            : 'Cadastre-se para acessar o sistema'
                        }
                    </h2>
                </div>

                <div className='w-full mb-6 sm:mb-8'>
                    <div className='relative bg-gray-200 rounded-full p-1 flex'>
                        <button
                            onClick={() => handleTabChange('login')}
                            className={`flex-1 py-2 sm:py-3 px-2 text-center relative z-10 font-medium text-xs sm:text-sm transition-all duration-300 ${activeTab === 'login'
                                ? 'text-gray-800'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => handleTabChange('cadastro')}
                            className={`flex-1 py-2 sm:py-3 px-2 text-center relative z-10 font-medium text-xs sm:text-sm transition-all duration-300 ${activeTab === 'cadastro'
                                ? 'text-gray-800'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Cadastro
                        </button>

                        <div
                            className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-8px)] bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${activeTab === 'login'
                                ? 'left-1'
                                : 'left-[calc(50%+3px)]'
                                }`}
                        />
                    </div>
                </div>

                <div className='w-full'>
                    {activeTab === 'login' && (
                        <div className='w-full space-y-3 sm:space-y-4 animate-fadeIn'>
                            {errors.login.general && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    {errors.login.general}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className='font-semibold text-gray-700 block mb-1 text-sm sm:text-base'>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.login.email}
                                    onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                                    className={`w-full bg-gray-100 h-9 sm:h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white text-sm sm:text-base ${errors.login.email ? 'border border-red-500' : ''}`}
                                    placeholder="email@exemplo.com"
                                />
                                {errors.login.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.login.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className='font-semibold text-gray-700 block mb-1 text-sm sm:text-base'>
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.login.password}
                                    onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                                    className={`w-full bg-gray-100 h-9 sm:h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white text-sm sm:text-base ${errors.login.password ? 'border border-red-500' : ''}`}
                                    placeholder="Digite sua senha"
                                />
                                {errors.login.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.login.password}</p>
                                )}
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className={`w-full bg-[#315aff] h-9 sm:h-10 rounded-lg text-white font-medium hover:bg-[#486dff] transition-colors duration-200 mt-3 sm:mt-4 cursor-pointer text-sm sm:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Entrando...
                                    </div>
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </div>
                    )}

                    {activeTab === 'cadastro' && (
                        <div className='w-full space-y-3 sm:space-y-4 animate-fadeIn flex flex-col'>
                            <h2 className='font-bold text-gray-900 self-center text-base sm:text-lg md:text-[18px] mb-2 sm:mb-[8px]'>
                                Crie uma Conta
                            </h2>

                            {/* Mensagem de erro geral */}
                            {errors.cadastro.general && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    {errors.cadastro.general}
                                </div>
                            )}

                            <div>
                                <label htmlFor="emailCadastro" className='font-semibold text-gray-700 block mb-1 text-sm sm:text-base'>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="emailCadastro"
                                    value={formData.cadastro.email}
                                    onChange={(e) => handleInputChange('cadastro', 'email', e.target.value)}
                                    className={`w-full bg-gray-100 h-9 sm:h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white text-sm sm:text-base ${errors.cadastro.email ? 'border border-red-500' : ''}`}
                                    placeholder="email@exemplo.com"
                                />
                                {errors.cadastro.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cadastro.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="senhaCadastro" className='font-semibold text-gray-700 block mb-1 text-sm sm:text-base'>
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="senhaCadastro"
                                    value={formData.cadastro.password}
                                    onChange={(e) => handleInputChange('cadastro', 'password', e.target.value)}
                                    className={`w-full bg-gray-100 h-9 sm:h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white text-sm sm:text-base ${errors.cadastro.password ? 'border border-red-500' : ''}`}
                                    placeholder="Crie uma senha (mínimo 6 caracteres)"
                                />
                                {errors.cadastro.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cadastro.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmarSenha" className='font-semibold text-gray-700 block mb-1 text-sm sm:text-base'>
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    id="confirmarSenha"
                                    value={formData.cadastro.confirmPassword}
                                    onChange={(e) => handleInputChange('cadastro', 'confirmPassword', e.target.value)}
                                    className={`w-full bg-gray-100 h-9 sm:h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white text-sm sm:text-base ${errors.cadastro.confirmPassword ? 'border border-red-500' : ''}`}
                                    placeholder="Confirme sua senha"
                                />
                                {errors.cadastro.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cadastro.confirmPassword}</p>
                                )}
                            </div>

                            <div className="text-xs sm:text-sm text-gray-600">
                                <p className="flex items-center">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    A senha deve ter no mínimo 6 caracteres
                                </p>
                            </div>

                            <button
                                onClick={handleCadastro}
                                disabled={loading}
                                className={`w-full bg-[#315aff] h-9 sm:h-10 rounded-lg text-white font-medium hover:bg-[#486dff] transition-colors duration-200 mt-3 sm:mt-4 cursor-pointer text-sm sm:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Criando conta...
                                    </div>
                                ) : (
                                    'Cadastrar'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};