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

    const [error, setError] = React.useState<string | null>(null);

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
        <div
            onMouseEnter={() => {
                document.body.style.overflow = "hidden";
            }}
            onMouseLeave={() => {
                document.body.style.overflow = "auto";
            }}
        >
            {mState && (
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
                                <div className="container">
                                    {error && <p className="error">{error}</p>}
                                    <form onSubmit={handleSubmit}>
                                        <p>Sign in :</p>
                                        <input
                                            type="text"
                                            placeholder="Email / Username"
                                            ref={email}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            ref={password}
                                        />
                                        <button type="submit">Signin</button>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </>
            ) }
        </div>
    );
};

export default Modal;

{
    /* <div className="sInputs">
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
                                    </div> */
}
