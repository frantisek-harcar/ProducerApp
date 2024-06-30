import { Button, Modal } from "react-bootstrap";
import styles from "../../styles/css/Modal.module.css"
import { useTranslation } from "react-i18next";
import { File as FileModel } from "../../models/file";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem";
import PaymentItemView from "./PaymentItemView";
import { useEffect, useState } from "react";
import styleUtils from "../../styles/css/utils.module.css"
import * as PaymentApi from "../../network/payments/payment_api";
import { SpinnerSmall } from "../Spinner";
import { PaymentTypes } from "../const/paymentTypes";

interface PaymentsDialogProps {
    paymentItems?: PaymentItemModel[],
    files?: FileModel[],
    onDismiss: () => void,
    onPaymentConfirmed: () => void,
}

const PaymentsDialog = ({ paymentItems, files, onDismiss, onPaymentConfirmed }: PaymentsDialogProps) => {
    const { t } = useTranslation();
    const [totalPrice, setTotalPrice] = useState(0);
    const [checkoutUrl, setCheckoutUrl] = useState("")

    useEffect(() => {
        let sum = 0

        paymentItems?.map((item) => (
            sum += item.price
        ))

        files?.map((item) => (
            sum += item.price
        ))

        setTotalPrice(sum);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, paymentItems])

    useEffect(() => {
        async function getCheckoutUrl() {
            let tempPaymentItems = paymentItems?.map((item) => (
                {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    type: PaymentTypes.PAYMENTITEM
                }
            ))

            let tempFiles = files?.map((item) => (
                {
                    id: item._id,
                    name: item.originalName,
                    price: item.price,
                    type: PaymentTypes.FILE
                }
            ))

            let tempCheckout = []

            if (tempPaymentItems) {
                tempCheckout.push(...tempPaymentItems)
            }

            if (tempFiles) {
                tempCheckout.push(...tempFiles)
            }

            if (tempCheckout.length > 0) {
                const checkoutResponse = await PaymentApi.checkout(tempCheckout)
                setCheckoutUrl(checkoutResponse.url)
            }
        }
        getCheckoutUrl();
    }, [files, paymentItems]);

    return (
        <>
            <Modal className={styles.modalContent} show onHide={onDismiss}>
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>
                        {t('projects.payments')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    {paymentItems?.map((item, index) => (
                        <div key={index}>
                            <PaymentItemView
                                name={item.name}
                                price={item.price}
                            />
                        </div>
                    ))}

                    {files?.map((item, index) => (
                        <div key={index}>
                            <PaymentItemView
                                name={item.originalName}
                                price={item.price}
                            />
                        </div>
                    ))}

                    <div className="mt-3 fs-4">
                        {totalPrice > 0 &&
                            <>
                                <PaymentItemView
                                    name={t('general.totalPrice')}
                                    price={totalPrice}
                                />
                            </>
                        }
                    </div>

                    <div className="mt-3 fs-4">
                        {!checkoutUrl &&
                            <>
                                <div className="mt-4">
                                    <SpinnerSmall />
                                </div>
                            </>
                        }
                        {checkoutUrl &&
                            <>
                                <Button
                                    className={`${styleUtils.width100} ${styleUtils.buttonColor}`}
                                    onClick={event => window.open(checkoutUrl)}
                                >
                                    {t('general.checkout')}
                                </Button>
                            </>
                        }
                    </div>

                </Modal.Body>
            </Modal>
        </>
    );

}


export default PaymentsDialog;