import React, {useEffect, useState} from "react";
import {useInterval} from "usehooks-ts";

const ReportGeneration = ({id, onBack}) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [completed, setCompleted] = useState<boolean>(false);
    const delay = 2000;

    const fetchStatus = React.useCallback(
        () =>
            fetch(`/api/v1/crypto/report/${id}/status`)
                .then((response) => {
                    if (!response.ok) {
                        return;
                    }
                    response.json().then(({status}) => {
                        if (status === "completed") {
                            setCompleted(true);
                        }

                        if (status === "unknown") {
                            setErrorMsg("Uh-oh, looks like something went wrong.");
                        }
                    });
                })
                .catch((error) => {
                    console.error(error);
                }),
        [id]
    );

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    useInterval(
        () => {
            fetchStatus();
        },
        !completed && !errorMsg ? delay : null
    );

    if (errorMsg) {
        return (
            <>
                <div>{errorMsg}</div>
                <button onClick={onBack}>Back to start</button>
            </>
        );
    }

    if (!completed) {
        return <div>Generating...</div>;
    }

    const downloadPDF = (url: string) => {
        const link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <button onClick={() => downloadPDF(`/api/v1/crypto/report/${id}`)}>Download PDF</button>
            <br />
            <button onClick={onBack}>Back to start</button>
        </>
    );
};

export default ReportGeneration;
