import { Col, Row } from "react-bootstrap";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem"
import styles from "../../styles/css/paymentItems.module.css"
import styleUtils from "../../styles/css/utils.module.css"
import { useTranslation } from "react-i18next";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";

interface PaymentItemDialogRowProps {
    paymentItem: PaymentItemModel;
    handlePaymentItemClick: (paymentItem: PaymentItemModel) => void;
}

const PaymentItemDialogRow = ({ paymentItem, handlePaymentItemClick }: PaymentItemDialogRowProps) => {
    const { t } = useTranslation();
    const authenticatedUser = useAuthenticatedUser();

    return (
        <>
            <Row className={`${styles.paymentItem} `}>
                <Col xs='7' md='7' xl='7' className={styles.bigLayout}>
                    <>
                        {authenticatedUser.user?.admin &&
                            <div
                                className={`${styles.paymentItemNameAdmin} ${styleUtils.clickable} `}
                                onClick={() => handlePaymentItemClick(paymentItem)}
                            >
                                {paymentItem.name}
                            </div>
                        }

                        {!authenticatedUser.user?.admin &&
                            <div className={`${styles.paymentItemName}`}>
                                {paymentItem.name}
                            </div>
                        }
                    </>
                </Col>
                <Col xs='5' md='5' xl='5' className={`${styles.priceRow} ${styles.bigLayout}`}>
                    <div className={styles.price}>
                        {paymentItem.price > 0 && (
                            <div className={`${styles.priceContainer} ${paymentItem.isPaid ? styleUtils.done : ""}`}>
                                <span className={styles.priceValue}>
                                    {paymentItem.price.toLocaleString(navigator.language)}
                                </span>
                                <span className={styles.currency}>
                                    {t('general.currency')}
                                </span>
                            </div>
                        )}


                        {paymentItem.price === 0 && (
                            <div className={styleUtils.done}>
                                {t('general.free')}
                            </div>
                        )}
                    </div>
                </Col>
                <Col xs='12' md='12' xl='12' className={styles.smallLayout}>
                    <div className={`${styles.paymentItemName}`}>
                        {paymentItem.name}
                    </div>
                </Col>
                <Col xs='12' md='12' xl='12' className={`${styles.priceRowSmall} ${styles.smallLayout}`}>
                    <div className={paymentItem.isPaid ? `${styleUtils.done} ${styles.price}` : styles.price}>
                        {paymentItem.price > 0 && (
                            <div className={`${styles.priceContainerSmall} ${paymentItem.isPaid ? styleUtils.done : ""}`}>
                                <span className={styles.priceValueSmall}>
                                    {paymentItem.price.toLocaleString(navigator.language)}
                                </span>
                                <span className={styles.currencySmall}>
                                    {t('general.currency')}
                                </span>
                            </div>
                        )}

                        {paymentItem.price === 0 && (
                            <div className={`${styles.priceValueSmall} ${styleUtils.done}`}>
                                {t('general.free')}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default PaymentItemDialogRow;