import { createRef, useEffect, useState } from "react";
import "./App.scss";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
    collection,
    message_Data,
    pocketBaseUrl,
} from "./scripts/globalVariable";
import { messageFormat, UserAgent } from "./scripts/globalInterface";
import Message from "./components/Message";
import { useLocalStorage } from "usehooks-ts";
import pb, { useCollection } from "./scripts/pocketbase";

function App() {
    const [id, setID] = useLocalStorage<string>("uuid", "");
    const ua: UserAgent = { username: "Anonymous", id };
    const messageRef = createRef<HTMLInputElement>();
    const {
        records: memory,
        invalidate,
        loading,
    } = useCollection<messageFormat>(collection, [], { realtime: true });
    console.log(memory)
    useEffect(() => {
        !id && setID(crypto.randomUUID());
    }, []);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();
        let payload: Partial<messageFormat> = {
            // puts every entry as conditionnal
            authorName: ua.username,
            authorID: ua.id,
            content: `${messageRef.current?.value}`,
        };
        const record = await pb.collection("unique_Chat").create(payload);
        console.log("Wow")
        console.log(record)
    };

    return (
        <div className="App">
            <Navbar ua={ua} />

            <div className="chatroom">
                <div className="chat">
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                    <Message messageData={message_Data} ua={ua} />
                </div>
                <div className="textInput">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name=""
                            placeholder="Send a message"
                            ref={messageRef}
                        />
                        <button type="submit">Send</button>
                    </form>
                    <div className="testButton">
                        <button
                            onClick={() => {
                                pb.collection("unique_Chat").unsubscribe();
                            }}
                        >
                            Unsubscribe
                        </button>
                        <button
                            onClick={() => {
                                ua.id = crypto.randomUUID();
                            }}
                        >
                            Change ID
                        </button>
                        <button
                            onClick={() => {
                                console.log(ua);
                            }}
                        >
                            Output UA
                        </button>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default App;
