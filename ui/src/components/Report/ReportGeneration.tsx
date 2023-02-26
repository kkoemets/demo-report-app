import React, {useEffect, useRef} from "react";

const ReportGeneration = ({id, onBack}) => {
    const [completed, setCompleted] = React.useState<boolean>(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

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
        2000,
        !completed && !errorMsg
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

// eslint-disable-next-line @typescript-eslint/ban-types
function useInterval(callback: Function, delay: number, enabled = true) {
    // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-empty-function
    const savedCallback = useRef<Function>(() => {});

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current?.();
        }

        let id = null;

        if (enabled && delay !== null) {
            id = setInterval(tick, delay);
        }

        return () => clearInterval(id);
    }, [delay, enabled]);
}
export default ReportGeneration;
