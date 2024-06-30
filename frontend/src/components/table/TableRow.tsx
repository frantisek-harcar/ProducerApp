import { ReactNode, useEffect, useState } from "react";
import styles from "../../styles/css/Table.module.css"
import styleUtils from "../../styles/css/utils.module.css"
import { Tag as TagModel } from '../../models/tag';
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddTagDialog from "../tags/AddTagDialog";
import { determineTextColor } from "../../utils/determineTextColor";
import * as TagApi from "../../network/tags/tag_api";

interface TableRowProps {
    item: ReactNode,
    className?: string,
    tags?: TagModel[],
    showAddTagButton: boolean,
    itemRowId: string,
    handleTagModalSubmit?: (rowId: string, tags: TagModel[]) => void,
    handleTagModalAdd?: (rowId: string, tag: TagModel) => void,
    onRowClick: () => void,
}

const TableRow = ({ item, itemRowId, handleTagModalSubmit, handleTagModalAdd, className, tags, onRowClick, showAddTagButton }: TableRowProps) => {

    const [localTags, setLocalTags] = useState<TagModel[]>([]);

    const [showAddTagDialog, setShowAddTagDialog] = useState(false);

    useEffect(() => {
        if (tags && tags.length > 0) {
            setLocalTags([...tags]);
        } else {
            setLocalTags([]);
        }
    }, [tags]);


    const handleButtonClick = () => {
        setShowAddTagDialog(true);
    };

    const handleSetActiveTags = (tags: TagModel[]) => {
        setLocalTags([...tags]);
    };

    async function handleDeleteTag(tag: TagModel) {
        try {
            await TagApi.deleteTag(tag._id);
            setLocalTags(localTags.filter(existingTag => existingTag._id !== tag._id))
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            <div className={styles.tableRow}>
                <div className={styles.tableRowItem} onClick={onRowClick}>
                    {item}
                </div>
                <div className={styles.tagContainer}>
                    {localTags && localTags.length > 0 &&
                        localTags.map(tagItem => (
                            <div
                                className={styles.tag}
                                key={tagItem._id}
                                style={{
                                    backgroundColor: `${tagItem.color}`,
                                    color: `${determineTextColor(tagItem.color ? tagItem.color : "#000")}`
                                }}
                            >
                                {tagItem.name}
                            </div>
                        ))
                    }
                    {showAddTagButton &&
                        <Button
                            className={`${styleUtils.btnTag}`}
                            onClick={() => handleButtonClick()}
                        >
                            <FaPlus />
                        </Button>
                    }
                </div>
            </div>

            {showAddTagDialog && handleTagModalSubmit && handleTagModalAdd &&
                <AddTagDialog
                    onDismiss={() => setShowAddTagDialog(false)}
                    onTagSaved={(newTag) => {
                        setLocalTags([...localTags, newTag]);
                        handleTagModalAdd(itemRowId, newTag);
                    }}
                    onAddTagsSaved={(tagItems) => {
                        setLocalTags(tagItems);
                        handleTagModalSubmit(itemRowId, tagItems);
                        setShowAddTagDialog(false);
                    }}
                    activeTags={localTags}
                    handleSetActiveTags={handleSetActiveTags}
                    handleDeleteTag={(tag) => handleDeleteTag(tag)}
                />
            }
        </>
    );
}

export default TableRow;