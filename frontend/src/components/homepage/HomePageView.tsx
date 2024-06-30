import { useState } from "react";
import { Button } from "react-bootstrap";
import LoginDialog from "./LoginDialog";
import { Navigate } from "react-router-dom";
import styleUtils from "../../styles/css/utils.module.css";
import styles from "../../styles/css/Homepage.module.css";
import { Paths } from "../const/paths";
import { useTranslation } from "react-i18next";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";


const HomePageView = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const authenticatedUser = useAuthenticatedUser()
    const { t } = useTranslation();

    return (
        <>

            {authenticatedUser.user &&
                <Navigate replace to={Paths.PROJECTS} />
            }
            <div className={styles.homepageContainer}>
                <div className={`${styleUtils.center} ${styles.titleContainer}`}>
                    {/* <h1 className={` ${styles.title}`}>{t('general.title')}</h1> */}
                    {/* <h2 className={` ${styles.subtitle}`}>{t('general.subtitle')}</h2> */}
                    {/* <div className={styles.shadow}></div> */}
                </div>

                <Button
                    className={`${styleUtils.blockCenter} ${styleUtils.center} ${styleUtils.btnHomepage}`}
                    onClick={() => { setShowLoginModal(true) }}>
                    {t('general.logIn')}
                </Button>
            </div>

            {showLoginModal &&
                <LoginDialog
                    onDismiss={() => { setShowLoginModal(false) }}
                    onLoginSuccessful={(user) => {
                        authenticatedUser.mutateUser(user);
                        setShowLoginModal(false);
                    }}
                />
            }
        </>
    );
}

export default HomePageView;