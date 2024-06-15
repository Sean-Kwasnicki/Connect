import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirectMessages, createDirectMessage } from "../../redux/directMessages";
import io from "socket.io-client";

const socket = io.connect("/");

const DirectMessagesPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const directMessages = useSelector((state) => state.directMessages.directMessages);
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState("");

    useEffect(() => {
        dispatch(fetchDirectMessages());
    }, [dispatch]);

    useEffect(() => {
        socket.on("direct_message", (data) => {
            dispatch(fetchDirectMessages()); 
        });

        return () => {
            socket.off("direct_message");
        };
    }, [dispatch]);

    const sendDirectMessage = async () => {
        if (message && recipientId) {
            await dispatch(createDirectMessage({ receiverId: recipientId, content: message }));
            socket.emit("direct_message", {
                message: { user: user.username, content: message },
                room: `user_${recipientId}`,
            });
            setMessage("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendDirectMessage();
    };

    return (
        <>
            <ul>
                {directMessages.map(({ sender, content, id }) => (
                    <li key={id}>
                        <span>{sender}</span>
                        <p>{content}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <label>
                    Recipient ID:
                    <input
                        type="text"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                    />
                </label>
                <label>
                    Message:
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </label>
                <button type="submit">Send Message</button>
            </form>
        </>
    );
};

export default DirectMessagesPage;
