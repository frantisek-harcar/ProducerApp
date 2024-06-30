// import { Form } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';

// export function LanguageSwitcher() {
//     const { i18n } = useTranslation();

//     const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         i18n.changeLanguage(event.target.value);
//     };

//     const defaultLanguage = navigator.language.startsWith('cs') ? 'cs' : 'en';

//     return (
//         <div>
//             <Form.Select defaultValue={i18n.language === "cs" ? "cs" : "en"} size="lg" onChange={handleLanguageChange}>
//             {/* <Form.Select defaultValue={defaultLanguage === 'cs' ? i18n.language = "cs" : i18n.language = "en"} size="lg" onChange={handleLanguageChange}> */}
//                 <option value="en">{i18n.t('settings.english')}</option>
//                 <option value="cs" >{i18n.t('settings.czech')}</option>
//             </Form.Select>
//         </div>
//     );
// }

import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    const defaultLanguage = navigator.language.startsWith('cs') ? 'cs' : 'en';

    return (
        <div>
            <Form.Select defaultValue={defaultLanguage} size="lg" onChange={handleLanguageChange}>
                <option value="en">{i18n.t('settings.english')}</option>
                <option value="cs" >{i18n.t('settings.czech')}</option>
            </Form.Select>
        </div>
    );
}