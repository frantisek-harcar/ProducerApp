import { useForm } from "react-hook-form";
import { User } from "../../models/user";
import { LoginCredentials } from "../../network/users/user_api";
import * as UsersApi from "../../network/users/user_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "../form/TextInputField";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { UnauthorizedError } from '../../errors/http_errors';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

interface LoginDialogProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

const LoginDialog = ({ onDismiss, onLoginSuccessful }: LoginDialogProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>()

    const { t } = useTranslation();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await UsersApi.login(credentials)
            onLoginSuccessful(user)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        <Modal className={styles.modalContent} centered show onHide={onDismiss}>
            <Modal.Header className={styles.modalHeader} closeButton closeVariant='white'>
                <Modal.Title>
                    {t('general.logIn')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {errorText &&
                    <Alert variant='danger'>
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        className={styles.modalInput}
                        name="email"
                        label={t('form.emailLabel')}
                        type="text"
                        placeholder={t('form.emailPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
                    />
                    <TextInputField
                        className={styles.modalInput}
                        name="password"
                        label={t('form.passwordLabel')}
                        type="password"
                        placeholder={t('form.passwordPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${styleUtils.width100} ${styleUtils.buttonColor}`}
                    >
                        {t('form.submit')}
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
    );
}

export default LoginDialog;