import * as React from 'react';
import error from "../assets/error1.png";
import {useEffect} from "react";

function ErrorPage() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    return (
        <div style={{
            minHeight: "87vh",
            backgroundColor: "rgba(207, 243, 233, 0.42)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 9%"
        }}>
            <img src={error} alt="Error" style={{
                maxWidth: "100%",
                marginTop: "-3%",
                maxHeight: "600px",
                height: "auto",
                width: "auto",
                objectFit: "contain",
                margin: 0
            }} />
        </div>
    );
}

export default ErrorPage;
