import React, { createRef } from "react";
import pb from "../scripts/pocketbase";
import "./Modal.scss";

interface Props {
    mState: boolean;
    setMState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ mState, setMState }: Props) => {
    const email = createRef<HTMLInputElement>();
    const password = createRef<HTMLInputElement>();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();
        let payload = {
            email: email.current?.value,
            password: password.current?.value,
        };
        console.log(payload);
        if (payload.email && payload.password) {
            await pb
                .collection("users")
                .authWithPassword(payload.email, payload.password);
            
            setMState(false);
            return true;
        } else {
            alert("Please fill all the fields");
            return false;
        }
    };

    return (
        <div>
            {mState ? (
                <>
                    <div
                        className="modalContainer"
                        onClick={() => {
                            setMState(false);
                        }}
                    >
                        <div
                            className="modal"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {
                                <form onSubmit={handleSubmit}>
                                    <h1></h1>
                                    <div className="sInputs">
                                        <label htmlFor="email">E-mail :</label>
                                        <input
                                            type="text"
                                            name="email"
                                            ref={email}
                                        />
                                        <label htmlFor="password">
                                            Password :
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            ref={password}
                                        />
                                    </div>
                                    <button type="submit">Signin</button>
                                </form>
                            }
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Modal;
