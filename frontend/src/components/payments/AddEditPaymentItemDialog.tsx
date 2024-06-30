import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { PaymentItem as PaymentItemModel } from "../../models/paymentItem";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useTranslation } from "react-i18next";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import * as PaymentItemsApi from "../../network/paymentItems/paymentItems_api"
import { useState } from "react";
import { PaymentItemInput } from "../../network/paymentItems/paymentItems_api";
import Checkbox from "../form/Checkbox";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

interface AddEditPaymentItemDialogProps {
    paymentItemToEdit?: PaymentItemModel,
    projectId: string,
    onDismiss: () => void,
    onPaymentItemSaved: (paymentItem: PaymentItemModel) => void,
    onPaymentItemDelete: (paymentItem: PaymentItemModel) => void,
}

const AddEditPaymentItemDialog = ({ paymentItemToEdit, projectId, onDismiss, onPaymentItemSaved, onPaymentItemDelete }: AddEditPaymentItemDialogProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }

    const confirmDelete = () => {
        if (onPaymentItemDelete && paymentItemToEdit) {
            setShowDeleteConfirmation(false);
            onPaymentItemDelete(paymentItemToEdit);
        }
    };

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PaymentItemInput>({
        defaultValues: {
            name: paymentItemToEdit?.name || "",
            price: paymentItemToEdit?.price || "",
            isPaid: paymentItemToEdit?.isPaid || undefined
        }
    });

    const { t } = useTranslation();

    async function onSubmit(input: PaymentItemInput) {
        try {
            let paymentItemResponse: PaymentItemModel
            input.projectId = projectId
            if (input.isPaid) {
                input.isPaid = new Date(Date.now())
            } else {
                input.isPaid = undefined
            }
            if (paymentItemToEdit) {
                paymentItemResponse = await PaymentItemsApi.updatePaymentItem(paymentItemToEdit._id, input);
            } else {
                paymentItemResponse = await PaymentItemsApi.createPaymentItem(input);
            }
            onPaymentItemSaved(paymentItemResponse);
        } catch (error) {
            if (error instanceof ConflictError || error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        <>
            <Modal className={styles.modalContent} show onHide={onDismiss}>
                <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                    <Modal.Title>
                        {paymentItemToEdit ? t('paymentItems.editPaymentItem') : t('paymentItems.addPaymentItem')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>


                    {errorText &&
                        <Alert variant='danger'>
                            {errorText}
                        </Alert>
                    }
                    <Form id="addEditPaymentItemForm" onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name={"name"}
                            label={t('form.nameLabel')}
                            placeholder={t('form.namePlaceholder')}
                            type="text"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.name}
                        />
                        <TextInputField
                            name={"price"}
                            label={t('form.priceLabel')}
                            type="number"
                            register={register}
                            registerOptions={{ required: "Required" }}
                        />

                        <Checkbox
                            name="isPaid"
                            label={t('form.paidLabel')}
                            type="checkbox"
                            register={register}
                            error={errors.isPaid}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${styleUtils.width100} ${styleUtils.flexCenter} ${styleUtils.buttonColor}`}
                        >
                            {t('form.submit')}
                        </Button>
                    </Form>
                </Modal.Body>
                {paymentItemToEdit &&
                    <Modal.Footer className={styles.modalFooter}>
                        <Button
                            variant="danger"
                            className="mt-3"
                            onClick={handleDelete}
                        >
                            {t('form.delete')}
                        </Button>
                    </Modal.Footer>
                }
            </Modal>

            {showDeleteConfirmation &&
                <ConfirmDeleteDialog
                    confirmDelete={confirmDelete}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    confirmDeleteTitle={t('form.confirmDeleteTitle')}
                    confirmDeleteMessage={t('paymentItems.confirmDeleteMessage')}
                />
            }
        </>
    );
}

export default AddEditPaymentItemDialog;