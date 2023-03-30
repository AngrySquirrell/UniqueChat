import { createRef, useEffect, useState } from "react";
import "./App.scss";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { collection, message_Data } from "./scripts/globalVariable";
import { messageFormat, UserAgent } from "./scripts/globalInterface";
import Message from "./components/Message";
import { useLocalStorage } from "usehooks-ts";
import pb, { useAuthStore, useCollection } from "./scripts/pocketbase";
import Chat from "./components/Chat";

function App() {
    const [id, setID] = useLocalStorage<string>("uuid", "");
    const { auth } = useAuthStore();
    const ua: UserAgent = auth.isValid
        ? { username: auth.model?.username, id: auth.model?.id }
        : { username: "Anonymous", id };
    const messageRef = createRef<HTMLTextAreaElement>();
    const {
        records: memory,
        invalidate,
        loading,
    } = useCollection<messageFormat>(collection, [], { realtime: true });

    console.log(memory);

    useEffect(() => {
        !id && setID(`${crypto.getRandomValues(new Uint32Array(1))[0]}`);
    }, []);

    const handleSubmit = async () => {
        let payload: Partial<messageFormat> = {
            // puts every entry as conditionnal
            authorName: ua.username,
            authorID: ua.id,
            content: `${messageRef.current?.value}`,
        };
        const record = await pb.collection("unique_Chat").create(payload);
    };

    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();
        handleSubmit();
        messageRef.current!.value = "";
    };

    const enterKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        event
    ) => {
        if (event.code == "Enter" && event.shiftKey == false) {
            event.preventDefault();
            handleSubmit();
            messageRef.current!.value = "";
        }
    };

    return (
        <div className="App">
            <div className="innerApp">
                <Navbar auth={auth} />

                <div className="chatroom">
                    <Chat memory={memory} ua={ua} />

                    <div className="textInput">
                        <form onSubmit={handleFormSubmit} className="">
                            <textarea
                                placeholder="Send a message"
                                ref={messageRef}
                                value={messageRef.current?.value}
                                required
                                spellCheck
                                onKeyDown={enterKey}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
                <Footer />
        </div>
    );
}

export default App;
