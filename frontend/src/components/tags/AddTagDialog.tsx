import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import { useEffect, useState } from "react";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { useTranslation } from "react-i18next";
import { Tag as TagModel } from '../../models/tag';
import { TagInput } from "../../network/tags/tag_api";
import * as TagApi from "../../network/tags/tag_api";
import AddTagFromList from "./AddTagFromList";

interface AddTagProps {
    onDismiss: () => void,
    onTagSaved: (tags: TagModel) => void,
    onAddTagsSaved: (tags: TagModel[]) => void,
    activeTags: TagModel[];
    handleSetActiveTags: (tags: TagModel[]) => void;
    handleDeleteTag: (tag: TagModel) => void;
}

const AddTagDialog = ({ activeTags, handleSetActiveTags, onDismiss, onTagSaved, onAddTagsSaved, handleDeleteTag }: AddTagProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [tags, setTags] = useState<TagModel[]>([]);

    const tagsWithCache = TagApi.useTags();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TagInput>({
        defaultValues: {
            name: "",
            color: "",
        }
    });

    useEffect(() => {
        if (tagsWithCache.tags) {
            const cachedTagsToState: TagModel[] = []
            tagsWithCache.tags.map((item) => (
                cachedTagsToState.push(item)
            ))
            setTags(cachedTagsToState);
        }
    }, [tagsWithCache.tags])

    const { t } = useTranslation();

    async function onSubmit(input: TagInput) {
        try {
            setTags(prev => {
                let tempTags = [...prev];

                return tempTags;
            });
            let tagResponse: TagModel;

            if (input.name.length > 0 && input.color.length > 0) {
                tagResponse = await TagApi.createTag(input);
                setTags([...tags, tagResponse]);
                onTagSaved(tagResponse);
            }

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
                        {t('tags.tags')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={styles.modalBody}>
                    {errorText &&
                        <Alert variant='danger'>
                            {errorText}
                        </Alert>
                    }
                    <Form id="createTagForm" onSubmit={handleSubmit(onSubmit)}>
                        <TextInputField
                            name="name"
                            label={t('form.nameLabel')}
                            type="text"
                            placeholder={t('form.namePlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.name}
                        />

                        <TextInputField
                            name="color"
                            label={t('form.colorLabel')}
                            type="color"
                            placeholder={t('form.colorPlaceholder')}
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.color}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${styleUtils.width100} ${styleUtils.buttonColor}`}
                        >
                            {t('tags.create')}
                        </Button>
                    </Form>
                    <AddTagFromList
                        activeTags={activeTags}
                        tags={tags}
                        handleSetActiveTags={handleSetActiveTags}
                        onAddTagsSaved={onAddTagsSaved}
                        handleDeleteTag={(tag) => handleDeleteTag(tag)}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddTagDialog;