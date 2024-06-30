import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ChangePasswordInput } from "../../network/users/user_api";
import * as UserApi from "../../network/users/user_api";
import TextInputField from "../form/TextInputField";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useState } from 'react';
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { useTranslation } from "react-i18next";

interface ChangePasswordDialogProps {
    onDismiss: () => void,
    onPasswordChanged: () => void,
}

const ChangePasswordDialog = ({ onDismiss, onPasswordChanged }: ChangePasswordDialogProps) => {
    const { t } = useTranslation();

    const [errorText, setErrorText] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChangePasswordInput>({});

    async function onSubmit(input: ChangePasswordInput) {
        try {
            await UserApi.changePassword(input);
            onPasswordChanged();
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
        <Modal className={styles.modalContent} show onHide={onDismiss}>
            <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                <Modal.Title>
                    {t('settings.changePassword')}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.modalBody}>
                {errorText &&
                    <Alert variant='danger'>
                        {errorText}
                    </Alert>
                }
                <Form id="changePasswordForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="oldPassword"
                        label={t('form.oldPasswordLabel')}
                        type="password"
                        placeholder={t('form.oldPasswordPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.oldPassword}
                    />

                    <TextInputField
                        name="newPassword"
                        label={t('form.newPasswordLabel')}
                        type="password"
                        placeholder={t('form.newPasswordPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.newPassword}
                    />

                    <TextInputField
                        name="newPasswordConfirmation"
                        label={t('form.newPasswordConfirmationLabel')}
                        type="password"
                        placeholder={t('form.newPasswordConfirmationPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.newPasswordConfirmation}
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
        </Modal>
    );
}

export default ChangePasswordDialog;