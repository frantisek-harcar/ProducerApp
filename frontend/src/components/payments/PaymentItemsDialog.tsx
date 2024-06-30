import { Modal } from "react-bootstrap";
import styles from "../../styles/css/Modal.module.css"
import { useTranslation } from "react-i18next";
import { File as FileModel } from "../../models/file";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem";
import PaymentItemView from "./PaymentItemView";
import { useEffect, useState } from "react";

interface PaymentsDialogProps {
    paymentItems?: PaymentItemModel[],
    files?: FileModel[],
    onDismiss: () => void,
}

const PaymentItemsDialog = ({ paymentItems, files, onDismiss }: PaymentsDialogProps) => {
    const { t } = useTranslation();
    const [totalPrice, setTotalPrice] = useState(0);

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

    return (
        <>
            <Modal className={styles.modalContent} show onHide={onDismiss}>
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>
                        {t('projects.paymentItems')}
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

                </Modal.Body>
            </Modal>
        </>
    );

}


export default PaymentItemsDialog;