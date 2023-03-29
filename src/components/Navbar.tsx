import React, { useState } from "react";
import "./Navbar.scss";
import { UserAgent } from "../scripts/globalInterface";
import pb, { useAuthStore } from "../scripts/pocketbase";
import { createPortal } from "react-dom";
import Modal from "./Modal";

interface Props {
    ua: UserAgent;
}

const Navbar = ({ ua }:Props) => {
    const { auth } = useAuthStore();
    const [mState, setMState]= useState<boolean>(false);

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
                            Signin
                        </button>
                ) : (
                    <>Logged in !</>
                )}
            </div>

            {createPortal( <Modal mState={mState} setMState={setMState} />
               ,
                document.body
            )}
        </div>
    );
};

export default Navbar;