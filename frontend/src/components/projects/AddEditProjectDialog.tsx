import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Project } from "../../models/project";
import { User as UserModel } from "../../models/user";
import * as ProjectApi from "../../network/projects/project_api";
import TextInputField from "../form/TextInputField";
import Select from "../form/Select";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { ProjectInput } from "../../network/projects/project_api";
import Checkbox from "../form/Checkbox";
import { useState } from "react";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { useTranslation } from "react-i18next";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

interface AddEditProjectDialogProps {
    users: UserModel[],
    projectToEdit?: Project,
    onDismiss: () => void,
    onProjectDelete: (project: Project) => void,
    onProjectSaved: (project: Project) => void,
}

const AddEditProjectDialog = ({ users, projectToEdit, onDismiss, onProjectSaved, onProjectDelete }: AddEditProjectDialogProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectInput>({
        defaultValues: {
            name: projectToEdit?.name || "",
            isDone: projectToEdit?.isDone || undefined,
            userId: projectToEdit?.userId || ""
        }
    });

    const { t } = useTranslation();

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    }

    const confirmDelete = () => {
        if (onProjectDelete && projectToEdit) {
            setShowDeleteConfirmation(false);
            onProjectDelete(projectToEdit);
        }
    };

    async function onSubmit(input: ProjectInput) {
        try {
            let projectResponse: Project;
            if (input.isDone) {
                input.isDone = new Date(Date.now())
            } else {
                input.isDone = undefined
            }
            if (projectToEdit) {
                projectResponse = await ProjectApi.updateProject(projectToEdit._id, input);
            } else {
                projectResponse = await ProjectApi.createProject(input);
            }
            onProjectSaved(projectResponse);
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
                        {projectToEdit ? t('projects.editProject') : t('projects.addProject')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={styles.modalBody}>
                    {errorText &&
                        <Alert variant='danger'>
                            {errorText}
                        </Alert>
                    }
                    <Form id="addEditProjectForm" onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name="name"
                            label={t('form.nameLabel')}
                            type="text"
                            placeholder={t('form.namePlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.name}
                        />

                        <Checkbox
                            name="isDone"
                            label={t('form.doneLabel')}
                            type="checkbox"
                            register={register}
                            error={errors.isDone}
                        />

                        <Select
                            name="userId"
                            label={t('form.userLabel')}
                            items={
                                users.map((user) => (
                                    { "id": user._id, "name": user.email }
                                ))
                            }
                            placeholder={t('form.userPlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.userId}
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
                {projectToEdit &&
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
                    confirmDeleteMessage={t('projects.confirmDeleteMessage')}
                />
            }
        </>
    );
}

export default AddEditProjectDialog;