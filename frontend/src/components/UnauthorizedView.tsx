import { Col } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styleUtils from "../styles/css/utils.module.css";
import { useEffect } from "react";
import { useAuthenticatedUser } from "../network/users/usersWithCache";

const UnauthorizedView = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const authenticatedUser = useAuthenticatedUser();

    function navigateToHomepage() {
        navigate("/");
    }

    useEffect(() => {
      if(!authenticatedUser.user && !authenticatedUser.userLoading) {
        navigateToHomepage()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticatedUser.user, authenticatedUser.userLoading])

    return (
        <>
        <div className={` ${styleUtils.flexCenter} ${styleUtils.center} ${styleUtils.width100}`}>
            <Col xs="2" md="3" lg="4">
                <p className={`${styleUtils.flexCenter}`}>
                    {t('error.unauthorized')}
                </p>
                <Button className={` ${styleUtils.buttonColor} ${styleUtils.blockCenter}`} onClick={navigateToHomepage}>{t('error.returnToHomepage')}</Button>
            </Col>
        </div>
    </>
    );
}

export default UnauthorizedView;