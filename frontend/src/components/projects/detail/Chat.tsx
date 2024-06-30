import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
import styles from "../../../styles/css/Chat.module.css";
import styleUtils from "../../../styles/css/utils.module.css";
import TextInputFieldNoLabel from "../../form/TextInputFieldNoLabel";
import * as FaIcons from 'react-icons/fa';
import { useContext, useEffect, useState, useRef } from "react";
import SocketContext from "../../../context/SocketContext";
import { useAuthenticatedUser } from "../../../network/users/usersWithCache";
import * as ProjectApi from "../../../network/projects/project_api";
import { User as UserModel } from "../../../models/user";
import { Chat as ChatModel } from "../../../models/chat";
import Spinner from "../../Spinner";
import { useTranslation } from "react-i18next";
import formStyles from "../../../styles/Form.module.scss";
import { formatDateToTime } from "../../../utils/formatDate";

interface ChatProps {
    projectId: string;
    recipient: UserModel | undefined;
    projectUserId: string;
}

// interface ChatCredentials {
//     message: string,
//     userId: string,
//     chatId: string
// }


interface MessageCredentials {
    message: string,
    userId: string,
    senderId: string,
    recipientId: string,
    createdAt: Date
}

const Chat = ({ projectId, recipient, projectUserId }: ChatProps) => {

    const socketContext = useContext(SocketContext);
    const socket = socketContext.SocketState.socket;
    const authenticatedUser = useAuthenticatedUser();

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const { t } = useTranslation();

    const [messages, setMessages] = useState<MessageCredentials[]>([])

    const [chatId, setChatId] = useState("");

    const [chat, setChat] = useState<ChatModel | null>(null);

    const [refreshReadMessages, setRefreshReadMessages] = useState<boolean>(false);

    const [chatLoading, setChatLoading] = useState(false);

    const [showChatLoadingError, setShowChatLoadingError] = useState(false);

    const { register, handleSubmit, reset } = useForm<MessageCredentials>({
        defaultValues: {
            message: "",
            userId: authenticatedUser.user?._id
        }
    })

    async function updateChat({ message, userId }: MessageCredentials, chatId: string) {
        try {

            const senderId = authenticatedUser.user?._id;
            const recipientId = recipient?._id;
            if (senderId && recipientId) {
                const chatInput: ProjectApi.ChatInput = {
                    message,
                    userId,
                    senderId,
                    recipientId,
                    chatId,
                };
                await ProjectApi.updateProjectChat(projectId, chatInput);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function onSubmit(input: MessageCredentials) {
        if (input.message !== "") {

            const senderId = authenticatedUser.user?._id;
            const recipientId = recipient?._id;
            const message = input.message;
            const userId = input.userId;
            const createdAt = new Date();
            if (senderId && recipientId) {
                const messageInput: MessageCredentials = {
                    message,
                    userId,
                    senderId,
                    recipientId,
                    createdAt,
                };
                socketContext.SocketState.socket?.emit("chatMessage", input, projectId);
                updateChat(messageInput, chatId);
            }

            reset();
        }
    }

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

            setRefreshReadMessages(!refreshReadMessages);
        }
        scrollToBottom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    useEffect(() => {
        async function getChat() {
            try {
                setShowChatLoadingError(false);
                setChatLoading(true);
                const chat = await ProjectApi.fetchProjectChat(projectId);
                setChat(chat);
                setChatId(chat._id);
                setMessages(chat.messages);
            } catch (error) {
                console.error(error);
                setShowChatLoadingError(true);
            } finally {
                setChatLoading(false);
            }
        }
        getChat();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function readMessages() {
            try {
                if (chat) {
                    const unreadMessagesIds = chat.messages
                        .filter((message) => message.status === "unread" && message.recipientId === authenticatedUser.user?._id)
                    if (unreadMessagesIds.length > 0 && unreadMessagesIds) {
                        const messageIds = unreadMessagesIds.map(message => message._id);
                        const readMessagesBody: ProjectApi.ReadMessagesInput = {
                            chatId: chatId,
                            messageIds: messageIds,
                        };
                        await ProjectApi.readMessages(projectId, readMessagesBody);
                    }
                }
            } catch (error) {
                console.error(error);
                setShowChatLoadingError(true);
            } finally {
                setChatLoading(false);
            }
        }
        readMessages();

    }, [refreshReadMessages, authenticatedUser.user?._id, chat, chatId, messages, projectId]);

    useEffect(() => {
        socket?.emit('join_room', projectId);
    }, [projectId, socket]);

    useEffect(() => {
        setRefreshReadMessages(!refreshReadMessages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const addMessage = (msg: MessageCredentials) => {
            setMessages([...messages, msg])
            setRefreshReadMessages(!refreshReadMessages);

        }
        socket?.on('message', addMessage);
    }, [messages, refreshReadMessages, socket]);

    return (
        <>
            <div className={styles.topBar}>
                <div className={`${styles.chatterName} ${styleUtils.flexCenter}`}>
                    {recipient?.name}
                </div>
            </div>
            <div className={styles.chat} onClick={() => { setRefreshReadMessages(!refreshReadMessages) }}>
                {chatLoading &&
                    <Spinner />
                }

                {showChatLoadingError &&
                    <Alert>
                        {t('general.loadingError')}
                    </Alert>
                }

                {!chatLoading &&
                    <>
                        <div className={styles.messagesContainer}>
                            {messages.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className={item.userId === authenticatedUser.user?._id ? `${styles.message} ${styles.senderRow}` : `${styles.message} ${styles.recipientRow}`}>
                                            <Row>
                                                <Col>
                                                    {/* <div className={styles.messageUsername}>
                                                        {item.userId === projectUserId &&
                                                            <div>
                                                                {recipient &&
                                                                    <>
                                                                        {recipient.name ?? recipient.email}
                                                                    </>
                                                                }
                                                            </div>
                                                        }
                                                    </div> */}

                                                    <div className={styles.messageContent}>
                                                        {item.message}
                                                        <span className={styles.sentAt}>
                                                            <span className={item.userId === authenticatedUser.user?._id ? `${styles.senderTime}` : ` ${styles.recipientTime}`} >
                                                                {item.createdAt &&
                                                                    <>
                                                                        {formatDateToTime("" + item.createdAt)}
                                                                    </>
                                                                }
                                                                {!item.createdAt &&
                                                                    <>
                                                                        {formatDateToTime("" + new Date())}
                                                                    </>
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>
                                                    
                                                </Col>
                                            </Row>

                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.sendMessageContainer}>
                            <Form
                                className={styleUtils.width100}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)(e);
                                }}
                            >
                                <Row className={styles.sendMessageForm}>
                                    <Col xs="10" md="10" lg="11">
                                        <TextInputFieldNoLabel
                                            className={`${styles.messageInput} ${formStyles.formControl}`}
                                            name="message"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="type your message"
                                            register={register}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmit(onSubmit)();
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col xs="2" md="2" lg="1">
                                        <Button
                                            className={styles.sendButton}
                                            type="submit"
                                        >
                                            <FaIcons.FaPaperPlane />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </>
                }

            </div>
        </>
    );
}

export default Chat;