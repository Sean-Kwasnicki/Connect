import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads, createThread } from "../../redux/threads";
import io from "socket.io-client";

const socket = io.connect("/");

const ThreadsPage = () => {
    const dispatch = useDispatch();
    const threads = useSelector((state) => state.threads.threads);
    const [messageId, setMessageId] = useState("");

    useEffect(() => {
        dispatch(fetchThreads());
    }, [dispatch]);

    useEffect(() => {
        socket.on("thread_created", (data) => {
            dispatch(fetchThreads()); 
        });

        return () => {
            socket.off("thread_created");
        };
    }, [dispatch]);

    const createNewThread = async () => {
        if (messageId) {
            await dispatch(createThread(messageId));
            socket.emit("create_thread", { message_id: messageId });
            setMessageId("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createNewThread();
    };

    return (
        <>
            <ul>
                {threads.map(({ id, message_id }) => (
                    <li key={id}>
                        <span>Message ID: {message_id}</span>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <label>
                    Message ID:
                    <input
                        type="text"
                        value={messageId}
                        onChange={(e) => setMessageId(e.target.value)}
                    />
                </label>
                <button type="submit">Create Thread</button>
            </form>
        </>
    );
};

export default ThreadsPage;
