import { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import * as UserApi from "../../network/users/user_api";
import styleUtils from "../../styles/css//utils.module.css"

interface NavBarLoggedInViewProps {
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    const { t } = useTranslation();
    const [errorText, setErrorText] = useState<string | null>(null)

    async function logout() {
        try {
            await UserApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            if(error instanceof UnauthorizedError || error instanceof ConflictError){
                setErrorText(error.message);
                console.error(errorText)
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return ( 
        <>
            <Button className={styleUtils.buttonColor} onClick={logout}>
                {t('general.logOut')}
            </Button>
        </>
     );
}

export default NavBarLoggedInView;