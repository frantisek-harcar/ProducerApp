import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../../models/user";
import { UserInput } from "../../network/users/user_api";
import * as UserApi from "../../network/users/user_api";
import TextInputField from "../form/TextInputField";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useState } from 'react';
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { useTranslation } from "react-i18next";
import generator from "generate-password-browser";

interface AddEditUserDialogProps {
    userToEdit?: User,
    onDismiss: () => void,
    onUserSaved: (user: User) => void,
}

const AddEditUserDialog = ({ userToEdit, onDismiss, onUserSaved }: AddEditUserDialogProps) => {
    const { t } = useTranslation();

    const [errorText, setErrorText] = useState<string | null>(null)

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<UserInput>({
        defaultValues: {
            name: userToEdit?.name || "",
            email: userToEdit?.email || "",
        }
    });

    const generatePassword = (): string => {
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        return password;
    }

    const handleGeneratePasswordClick = () => {
        const newPassword = generatePassword();
        setValue("password", newPassword);
    }

    async function onSubmit(input: UserInput) {
        try {
            let userResponse: User;
            if (userToEdit) {
                userResponse = await UserApi.updateUser(userToEdit._id, input);
            } else {
                userResponse = await UserApi.createUser(input);
            }
            onUserSaved(userResponse);
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
                    {userToEdit ? t('users.editUser') : t('users.addUser')}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.modalBody}>
                {errorText &&
                    <Alert variant='danger'>
                        {errorText}
                    </Alert>
                }
                <Form id="addEditUserForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="name"
                        label={t('form.nameUserLabel')}
                        type="text"
                        placeholder={t('form.nameUserPlaceholder')}
                        register={register}
                        error={errors.name}
                    />

                    <TextInputField
                        name="email"
                        label={t('form.emailLabel')}
                        type="email"
                        placeholder={t('form.emailPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
                    />

                    <TextInputField
                        name="password"
                        label={t('form.passwordLabel')}
                        type="password"
                        placeholder={t('form.passwordPlaceholder')}
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />

                    <Button
                        onClick={handleGeneratePasswordClick}
                        className={`${styleUtils.width100} ${styleUtils.flexCenter} ${styleUtils.btnBorder} mb-2`}
                    >
                        {t('form.generatePassword')}
                    </Button>

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

export default AddEditUserDialog;