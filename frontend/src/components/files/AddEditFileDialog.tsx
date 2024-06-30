import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FileInput, UpdateFileInput } from "../../network/files/files_api";
import TextInputField from "../form/TextInputField";
import { File as FileModel } from "../../models/file";
import { Project as ProjectModel } from "../../models/project";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useTranslation } from "react-i18next";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import * as FileApi from "../../network/files/files_api"
import { useState } from "react";
import { useAuthenticatedUser } from "../../network/users/usersWithCache";
import Select from "../form/Select";
import { SpinnerSmall } from "../Spinner";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

interface AddEditFileDialogProps {
    fileToEdit?: FileModel,
    fromProjectDetail?: boolean,
    projects: ProjectModel[],
    onDismiss: () => void,
    onFileDelete: (file: FileModel) => void,
    onFileSaved: (file: FileModel) => void,
}

const AddEditFileDialog = ({ fileToEdit, fromProjectDetail, projects, onDismiss, onFileDelete, onFileSaved }: AddEditFileDialogProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FileInput>({
        defaultValues: {
            price: fileToEdit?.price || ""
        }
    });

    const { t } = useTranslation();

    const authenticatedUser = useAuthenticatedUser()

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }

    const confirmDelete = () => {
        if (onFileDelete && fileToEdit) {
            setShowDeleteConfirmation(false);
            onFileDelete(fileToEdit);
        }
    };

    async function onSubmit(input: FileInput) {
        let fileResponse: FileModel;
        const formData = new FormData();

        var priceAsString = ""
        if (input.price) {
            priceAsString = input.price.toString()
        }
        formData.append("price", priceAsString)

        if (input.projectId) {
            formData.append("projectId", input.projectId)
        }

        const updateFileInput: UpdateFileInput = { price: input.price ?? 0 }

        try {
            if (fileToEdit) {
                fileResponse = await FileApi.updateFile(fileToEdit._id, updateFileInput);
            } else {
                formData.append("file", input.file[0]);
                if (authenticatedUser.user?._id) {
                    formData.append("userId", authenticatedUser.user._id)
                }
                fileResponse = await FileApi.createFile(formData);
            }
            onFileSaved(fileResponse);
            // await FileApi.createFile(formData);
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
                        {fileToEdit ? "Edit File" : "Add File"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>


                    {errorText &&
                        <Alert variant='danger'>
                            {errorText}
                        </Alert>
                    }
                    <Form id="uploadFileForm" onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name={"price"}
                            label={t('form.priceLabel')}
                            placeholder={t('form.pricePlaceholder')}
                            type="number"
                            register={register}
                            registerOptions={{ required: "Required" }}
                        />
                        {!fileToEdit &&
                            <TextInputField
                                name={"file"}
                                label={t('form.uploadFile')}
                                type="file"
                                multiple
                                register={register}
                                registerOptions={{ required: "Required" }}
                            />

                        }
                        {!fromProjectDetail &&
                            <>
                                {!fileToEdit &&
                                    <Select
                                        name="projectId"
                                        label={t('form.uploadToProject')}
                                        items={
                                            projects
                                                // .filter((project) => (
                                                //     !project.files.includes(fileToEdit?._id ?? "")
                                                // ))
                                                .map((project) => (
                                                    { "id": project._id, "name": project.name, }
                                                ))
                                        }
                                        placeholder={t('form.userPlaceholder')}
                                        register={register}
                                        registerOptions={{ required: "Required" }}
                                    />
                                }
                            </>
                        }

                        {!isSubmitting &&
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`${styleUtils.width100} ${styleUtils.flexCenter} ${styleUtils.buttonColor}`}
                            >
                                {t('form.submit')}
                            </Button>
                        }

                        {isSubmitting &&
                            <div className="my-2">
                                <SpinnerSmall />
                            </div>
                        }
                    </Form>
                </Modal.Body>
                {fileToEdit &&
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
                    confirmDeleteMessage={t('files.confirmDeleteMessage')}
                />
            }
        </>
    );
}

export default AddEditFileDialog;