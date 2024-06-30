import { useTranslation } from "react-i18next";
import HomePageView from "../components/homepage/HomePageView";
import { useEffect } from 'react';

const HomePage = () => {
    const { i18n } = useTranslation();
    
    const defaultLanguage = navigator.language.startsWith('cs') ? 'cs' : 'en';

    useEffect(() => {
        i18n.changeLanguage(defaultLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HomePageView />
        </>
    );
}

export default HomePage;