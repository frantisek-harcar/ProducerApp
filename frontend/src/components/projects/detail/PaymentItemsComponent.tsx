import { useTranslation } from "react-i18next";
import styles from "../../../styles/css/ProjectDetail.module.css";
import styleUtils from "../../../styles/css/utils.module.css";
import { PaymentItem as PaymentItemModel } from "../../../models/paymentItem";
import { Project as ProjectModel } from '../../../models/project';
import { File as FileModel } from '../../../models/file';
import { Button } from "react-bootstrap";
import { useAuthenticatedUser } from "../../../network/users/usersWithCache";
import { FaPlus } from "react-icons/fa";
import PaymentItemDialogRow from "../../payments/PaymentItemDialogRow";

interface PaymentItemsComponentProps {
    paymentItems: PaymentItemModel[],
    files: FileModel[],
    project: ProjectModel,
    handlePaymentItemCLick: (paymentItem: PaymentItemModel) => void,
    handleShowPaymentsDialog: () => void,
    handleShowPaymentItemsDialog: () => void,
    handleShowAddPaymentItemsDialog: () => void,
}

const PaymentItemsComponent = ({ paymentItems, project, files, handlePaymentItemCLick, handleShowAddPaymentItemsDialog, handleShowPaymentsDialog, handleShowPaymentItemsDialog }: PaymentItemsComponentProps) => {
    const { t } = useTranslation();
    const authenticatedUser = useAuthenticatedUser();
    return (
        <>
            <Button className={`${styleUtils.blockCenter} ${styleUtils.btnPayment} ${styleUtils.width75}`}
                onClick={handleShowPaymentsDialog}
                disabled={
                    (paymentItems.every(item => item.projectId === project?._id && item.isPaid) &&
                        files.every(file => project?.files.includes(file._id) && file.isPaid)) ||
                    (paymentItems.length === 0 && files.length === 0)
                }
            >
                {t('projects.payments')}
            </Button>
            {authenticatedUser.user?.admin &&
                <>
                    <Button
                        className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} ${styleUtils.buttonColor} ${styleUtils.width75}`}
                        onClick={handleShowAddPaymentItemsDialog}
                    >
                        <FaPlus className='me-2' />
                        {t('paymentItems.addPaymentItem')}
                    </Button>
                </>
            }
            {
                paymentItems.filter((paymentItem) => (
                    paymentItem.projectId === project?._id
                )).length > 0 &&


                <div className={`${styles.paymentItems} pt-2`}>
                    <>
                        <div className={styles.paymentItemsContent}>
                            {
                                paymentItems
                                    .filter((paymentItem) => (paymentItem.projectId === project?._id))
                                    .sort((a, b) => {
                                        if (a.isPaid !== b.isPaid) {
                                            return a.isPaid ? 1 : -1;
                                        }
                                        return a.price - b.price;
                                    })
                                    .map((paymentItem, index) => (
                                        <div key={index}>
                                            <PaymentItemDialogRow
                                                paymentItem={paymentItem}
                                                handlePaymentItemClick={(clickedPaymentItem) => { handlePaymentItemCLick(clickedPaymentItem) }}
                                            />
                                        </div>
                                    ))
                            }
                        </div>
                        <hr />
                    </>
                </div>
            }

            <Button
                className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.buttonColor} ${styleUtils.width75}`}
                onClick={handleShowPaymentItemsDialog}
            >
                {t('paymentItems.showItems')}
            </Button>
        </>
    );
}

export default PaymentItemsComponent;