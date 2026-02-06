import { useState, useEffect } from 'react';

export const useUserData = () => {
    const [userData, setUserData] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Obter ID do usuário atual
    const getUserId = (): string | null => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            return user.id || user.email || null;
        }
        return null;
    };

    useEffect(() => {
        const loadUserData = () => {
            const userId = getUserId();
            if (!userId) {
                setLoading(false);
                return;
            }

            const userKey = `user_${userId}`;
            const companyKey = `company_${userId}`;
            const onboardingKey = `onboarding_${userId}`;

            const storedUser = localStorage.getItem(userKey);
            const storedCompany = localStorage.getItem(companyKey);
            const storedOnboarding = localStorage.getItem(onboardingKey);

            if (storedUser) setUserData(JSON.parse(storedUser));
            if (storedCompany) setCompanyData(JSON.parse(storedCompany));

            setLoading(false);
        };

        loadUserData();
    }, []);

    const saveUserData = (data: any) => {
        const userId = getUserId();
        if (!userId) return;

        const userKey = `user_${userId}`;
        localStorage.setItem(userKey, JSON.stringify(data));
        setUserData(data);
    };

    // Salvar dados da empresa
    const saveCompanyData = (data: any) => {
        const userId = getUserId();
        if (!userId) return;

        const companyKey = `company_${userId}`;
        const onboardingKey = `onboarding_${userId}`;

        localStorage.setItem(companyKey, JSON.stringify(data));
        localStorage.setItem(onboardingKey, 'true');
        setCompanyData(data);
    };

    // Verificar se onboarding foi completado
    const hasCompletedOnboarding = (): boolean => {
        const userId = getUserId();
        if (!userId) return false;

        const onboardingKey = `onboarding_${userId}`;
        return localStorage.getItem(onboardingKey) === 'true';
    };

    // Limpar dados do usuário (logout)
    const clearUserData = () => {
        const userId = getUserId();
        if (userId) {
            localStorage.removeItem(`user_${userId}`);
            localStorage.removeItem(`company_${userId}`);
            localStorage.removeItem(`onboarding_${userId}`);
        }
        setUserData(null);
        setCompanyData(null);
    };

    return {
        userData,
        companyData,
        loading,
        saveUserData,
        saveCompanyData,
        hasCompletedOnboarding,
        clearUserData,
        getUserId
    };
};