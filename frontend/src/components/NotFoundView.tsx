import { Col } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styleUtils from "../styles/css/utils.module.css";

const NotFoundView = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    function handleClick() {
        navigate("/");
      }
    
    return (
        <>
            <div className={` ${styleUtils.flexCenter} ${styleUtils.center} ${styleUtils.width100}`}>
                <Col xs="2" md="3" lg="4">
                    <p className={`${styleUtils.flexCenter}`}>
                        {t('error.pageNotFound')}
                    </p>
                    <Button className={` ${styleUtils.buttonColor} ${styleUtils.blockCenter}`} onClick={handleClick}>{t('error.returnToHomepage')}</Button>
                </Col>
            </div>
        </>
    );
}

export default NotFoundView;