import { BaseAuthStore } from "pocketbase";
import { messageData, UserAgent } from "../scripts/globalInterface";
import Message from "./Message";
import "./Chat.scss";
import { createRef, useEffect } from "react";

interface Props {
    memory: messageData[];
    ua: UserAgent;
}

const Chat = ({ memory, ua }: Props) => {
    const dummy = createRef<HTMLDivElement>();

    useEffect(() => {
        dummy.current?.scrollIntoView({block:'end', behavior: "smooth" , inline: 'start' });
        document.body.style.overflow = "auto";
    }, [memory]);

    return (
        <div
            className="messagesContainer"
            onMouseEnter={() => {
                document.body.style.overflow = "hidden";
            }}
            onMouseLeave={() => {
                document.body.style.overflow = "auto";
            }}
        >
            {memory.map((el, id) => {
                return (
                    <Message
                        isAuthor={ua.id === el.authorID ? "right" : "left"}
                        key={id}
                        messageData={el}
                        ua={ua}
                    />
                );
            })}
            <div ref={dummy} className="dummy"></div>
        </div>
    );
};

export default Chat;
