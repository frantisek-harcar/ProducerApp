import { useTranslation } from 'react-i18next';
import styleUtils from '../../styles/utils.module.scss';
import { Col, Row } from "react-bootstrap";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem";
import styles from "../../styles/css/paymentItems.module.css";

interface PaymentItemViewProps {
    name: string,
    price: number
    onEditPaymentItemClicked?: (paymentItem: PaymentItemModel) => void,
    onDeletePaymentItemClicked?: (paymentItem: PaymentItemModel) => void,
}

const PaymentItemView = ({ name, price, onEditPaymentItemClicked, onDeletePaymentItemClicked }: PaymentItemViewProps) => {
    const { t } = useTranslation();
    return (
        <>
            <Row className={`${styleUtils.flex} py-2`}>
                <Col xs md xl='6'>
                    {name}
                </Col>
                <Col xs md xl='5' className={`${styleUtils.flexCenter} ${styles.priceRow}`}>
                    {price > 0 && (
                        <div className={styles.priceContainer}>
                            <span className={styles.priceValue}>
                                {price.toLocaleString(navigator.language)}
                            </span>
                            <span className={styles.currency}>
                                {t('general.currency')}
                            </span>
                        </div>
                    )}

                    {price === 0 && (
                        <div className={styleUtils.done}>
                            {t('general.free')}
                        </div>
                    )}
                </Col>
            </Row>

        </>
    );
}

export default PaymentItemView;