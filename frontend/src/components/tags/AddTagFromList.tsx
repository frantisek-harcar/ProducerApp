import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styleUtils from "../../styles/css/utils.module.css"
import styles from "../../styles/css/Modal.module.css"
import styleTags from "../../styles/css/Table.module.css"
import { useEffect, useState } from "react";
import { ConflictError, UnauthorizedError } from "../../errors/http_errors";
import { useTranslation } from "react-i18next";
import { Tag as TagModel } from '../../models/tag';
import { TagInput } from "../../network/tags/tag_api";
import TagView from "./TagView";

interface AddTagProps {
    onAddTagsSaved: (tags: TagModel[]) => void,
    tags: TagModel[],
    activeTags: TagModel[],
    handleSetActiveTags: (tags: TagModel[]) => void,
    handleDeleteTag: (tag: TagModel) => void
}

const AddTagFromList = ({ activeTags, handleSetActiveTags, tags, onAddTagsSaved, handleDeleteTag }: AddTagProps) => {

    const [errorText, setErrorText] = useState<string | null>(null)

    const [tagList, setTagList] = useState<TagModel[]>([]);

    const [showDeleteButtonOnTag, setShowDeleteButtonOnTag] = useState<boolean>(false);

    const { handleSubmit, formState: { isSubmitting } } = useForm<TagInput>({
        defaultValues: {
            name: "",
            color: "",
        }
    });

    useEffect(() => {
        if (tags) {
            setTagList(tags)
        }
    }, [tags])


    const { t } = useTranslation();

    async function onSubmit() {
        try {
            onAddTagsSaved(activeTags);
        } catch (error) {
            if (error instanceof ConflictError || error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    async function deleteTag(tag: TagModel) {
        setTagList(tagList.filter(existingTag => existingTag._id !== tag._id));
        handleDeleteTag(tag);
    }

    return (
        <>
            <Modal.Header className={styles.modalHeader} closeVariant='white'>
                <Modal.Title>
                    {t('tags.addTags')}
                </Modal.Title>

                <div
                    className={showDeleteButtonOnTag ? `${styleTags.removeTagButtonToggled}` : `${styleTags.removeTagButton}`}
                    onClick={() => setShowDeleteButtonOnTag(!showDeleteButtonOnTag)}
                >
                    {t('tags.enableDelete')}
                </div>
            </Modal.Header>

            {errorText &&
                <Alert variant='danger'>
                    {errorText}
                </Alert>
            }

            <Form id="addTagForm" onSubmit={handleSubmit(onSubmit)}>
                <div className={styleTags.tagModalContainer}>

                    {tagList &&
                        <TagView
                            tags={tagList}
                            activeTags={activeTags}
                            setActiveTags={handleSetActiveTags}
                            showDeleteButtonOnTag={showDeleteButtonOnTag}
                            onDeleteTagClicked={(tag) => deleteTag(tag)}
                        />
                    }
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${styleUtils.width100} ${styleUtils.buttonColor}`}
                >
                    {t('tags.add')}
                </Button>
            </Form>
        </>
    );
}

export default AddTagFromList;