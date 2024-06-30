import { Tag as TagModel } from '../../models/tag';
import styleTags from "../../styles/css/Table.module.css";
import styleUtils from "../../styles/css/utils.module.css";
import { determineTextColor } from "../../utils/determineTextColor";
import { FaTimes } from "react-icons/fa";

interface TagViewProps {
    tags: TagModel[],
    activeTags: TagModel[],
    showDeleteButtonOnTag: boolean,
    setActiveTags: (tags: TagModel[]) => void,
    onDeleteTagClicked: (tag: TagModel) => void,
}

const TagView = ({ tags, activeTags, showDeleteButtonOnTag, setActiveTags, onDeleteTagClicked }: TagViewProps) => {

    const handleClick = (tag: TagModel) => {
        const isActive = activeTags.some(activeTag => activeTag._id === tag._id);

        if (isActive) {
            setActiveTags(activeTags.filter(activeTag => activeTag._id !== tag._id));
        } else {
            setActiveTags([...activeTags, tag]);
        }
    };

    return (
        <>
            {tags &&
                tags.map(tagItem => {
                    const isActive = activeTags.some(activeTag => activeTag._id === tagItem._id);

                    return (
                        <div className={styleTags.tagModalContainerContent}
                            key={tagItem._id}
                        >
                            <div
                                className={`${styleUtils.clickable} ${isActive ? styleTags.tagModalHighlighted : styleTags.tagModal}`}
                                style={{
                                    backgroundColor: `${tagItem.color}`,
                                    color: `${determineTextColor(tagItem.color)}`
                                }}
                                onClick={() => handleClick(tagItem)}
                            >
                                {tagItem.name}
                            </div>
                            {showDeleteButtonOnTag &&

                                <div
                                    className={`${styleTags.delete} ${styleUtils.clickable}`}
                                >
                                    <FaTimes
                                        onClick={(e) => {
                                            onDeleteTagClicked(tagItem);
                                            e.stopPropagation();
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    );
                })}
        </>
    );
}

export default TagView;
