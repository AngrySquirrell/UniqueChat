import React, { useState } from "react";
import "./Navbar.scss";
import pb, { useAuthStore } from "../scripts/pocketbase";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import { BaseAuthStore } from "pocketbase";

interface Props {
    auth: BaseAuthStore;
}

const Navbar = ({ auth }: Props) => {
    const [mState, setMState] = useState<boolean>(false);

    return (
        <div className="navbar">
            <div className="left">Unique Chat</div>
            <div className="right">
                {!auth.isValid ? (
                    <button
                        onClick={() => {
                            setMState(true);
                        }}
                    >
                        Sign in
                    </button>
                ) : (
                    <div className="farRight">
                        Logged in as : {auth.model?.username}
                        <button
                        className="signout"
                            onClick={() => {
                                pb.authStore.clear();
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>

            {createPortal(
                <Modal mState={mState} setMState={setMState} />,
                document.body
            )}
        </div>
    );
};

export default Navbar;
