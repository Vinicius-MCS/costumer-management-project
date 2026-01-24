import { useState } from "react";
import logo from '../../assets/images/logo.png';

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <>
            <main className='bg-[#acc5ff9a] flex justify-center items-center min-h-screen py-[40px]'>
                <div className='bg-white flex flex-col justify-center h-auto min-h-[500px] w-[450px] items-center rounded-2xl p-10'>
                    <div className='flex flex-col items-center mb-5'>
                        <img src={logo} alt="Logo" className='h-[70px] m-[5px]' />
                        <h1 className='text-3xl font-bold'>Sistema de Gestão</h1>
                        <h2 className='text-base text-gray-600 font-medium mt-2'>
                            {activeTab === 'login'
                                ? 'Faça login para acessar o painel de clientes'
                                : 'Cadastre-se para acessar o sistema'
                            }
                        </h2>
                    </div>

                    {/* Barra de alternância */}
                    <div className='w-full mb-8'>
                        <div className='relative bg-gray-200 rounded-full p-1 flex'>
                            {/* Botões das abas */}
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-3 px-2 text-center relative z-10 font-medium text-sm transition-all duration-300 ${activeTab === 'login'
                                        ? 'text-gray-800'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Login
                            </button>

                            <button
                                onClick={() => setActiveTab('cadastro')}
                                className={`flex-1 py-3 px-2 text-center relative z-10 font-medium text-sm transition-all duration-300 ${activeTab === 'cadastro'
                                        ? 'text-gray-800'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Cadastro
                            </button>

                            {/* Indicador móvel */}
                            <div
                                className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-8px)] bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${activeTab === 'login'
                                        ? 'left-1'
                                        : 'left-[calc(50%+3px)]'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Formulários */}
                    <div className='w-full'>
                        {/* Formulário de Login */}
                        {activeTab === 'login' && (
                            <div className='w-full space-y-4 animate-fadeIn'>
                                <div>
                                    <label htmlFor="email" className='font-semibold text-gray-700 block mb-1'>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="email@exemplo.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className='font-semibold text-gray-700 block mb-1'>
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Digite sua senha"
                                    />
                                </div>

                                <button className='w-full bg-[#315aff] h-10 rounded-lg text-white font-medium hover:bg-[#486dff] transition-colors duration-200 mt-4'>
                                    Entrar
                                </button>
                            </div>
                        )}

                        {activeTab === 'cadastro' && (
                            <div className='w-full space-y-4 animate-fadeIn flex flex-col'>
                                <h2 className='font-bold text-gray-900 mb-1 self-center text-[18px] mb-[14px]'>Dados de Acesso</h2>

                                <div>
                                    <label htmlFor="emailCadastro" className='font-semibold text-gray-700 block mb-1'>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="emailCadastro"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="email@exemplo.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="senhaCadastro" className='font-semibold text-gray-700 block mb-1'>
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        id="senhaCadastro"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Crie uma senha"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmarSenha" className='font-semibold text-gray-700 block mb-1'>
                                        Confirmar Senha
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmarSenha"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Confirme sua senha"
                                    />
                                </div>

                                <h2 className='font-bold text-gray-900 mb-1 self-center text-[18px] mb-[14px] mt-[20px]'>Dados do Proprietário</h2>
                                <div>
                                    <label htmlFor="nomeProprietario" className='font-semibold text-gray-700 block mb-1'>
                                        Nome Completo do Proprietário
                                    </label>
                                    <input
                                        type="text"
                                        id="nomeProprietário"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Nome completo"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cpfProprietario" className='font-semibold text-gray-700 block mb-1'>
                                        CPF do Proprietário
                                    </label>
                                    <input
                                        type="text"
                                        id="cpfProprietario"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="rgProprietario" className='font-semibold text-gray-700 block mb-1'>
                                        RG do Proprietário
                                    </label>
                                    <input
                                        type="text"
                                        id="rgProprietario"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="00-000.000"
                                    />
                                </div>

                                <h2 className='font-bold text-gray-900 mb-1 self-center text-[18px] mb-[14px] mt-[20px]'>Dados da Empresa</h2>
                                <div>
                                    <label htmlFor="nomeEmpresa" className='font-semibold text-gray-700 block mb-1'>
                                        Nome da Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="nomeEmpresa"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Nome completo da empresa"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cnpjEmpresa" className='font-semibold text-gray-700 block mb-1'>
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        id="cnpjEmpresa"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="00.000.000/0001-00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="nomeFantasia" className='font-semibold text-gray-700 block mb-1'>
                                        Nome Fantasia
                                    </label>
                                    <input
                                        type="text"
                                        id="nomeFantasia"
                                        className='w-full bg-gray-100 h-10 px-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315aff] focus:bg-white'
                                        placeholder="Nome fantasia da empresa"
                                    />
                                </div>

                                <button className='w-full bg-[#315aff] h-10 rounded-lg text-white font-medium hover:bg-[#486dff] transition-colors duration-200 mt-4'>
                                    Cadastrar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}