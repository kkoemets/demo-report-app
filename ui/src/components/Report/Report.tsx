import React, {useEffect} from "react";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import ReportForm from "components/Report/ReportForm";
import ReportGeneration from "components/Report/ReportGeneration";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Report: React.FC = () => {
    const {id} = useParams();
    const [reportId, setReportId] = React.useState<string | null>(id);
    const [currentForm, setCurrentForm] = React.useState<React.ReactNode>(
        <ReportForm setReportId={setReportId} />
    );

    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/${reportId || ""}`);

        if (!reportId) {
            setCurrentForm(<ReportForm setReportId={setReportId} />);
            return;
        }

        setCurrentForm(<ReportGeneration onBack={() => setReportId(null)} id={reportId} />);
    }, [reportId, navigate]);

    return (
        <Container>
            <h1>Generate crypto candlestick reports</h1>
            {currentForm}
        </Container>
    );
};

export default Report;
