import { Button, Col } from "react-bootstrap";
import styleUtils from "../../styles/css/utils.module.css"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentSuccessfulPageView = () => {

    const { t } = useTranslation();
    
    const navigate = useNavigate();

    function navigateToHomepage() {
        navigate("/");
    }
    return (
        <>
            <div className={` ${styleUtils.flexCenter} ${styleUtils.center} ${styleUtils.width100}`}>
            <Col xs="2" md="3" lg="4">
                <p className={`${styleUtils.flexCenter}`}>
                    {t('payment.success')}
                </p>
                <Button className={` ${styleUtils.buttonColor} ${styleUtils.blockCenter}`} onClick={navigateToHomepage}>{t('error.returnToHomepage')}</Button>
            </Col>
        </div>
        </>
    );
}

export default PaymentSuccessfulPageView;