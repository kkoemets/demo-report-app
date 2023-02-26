import React from "react";
import {Formik} from "formik";
import {DatePicker, Form, Select, SubmitButton} from "formik-antd";

const ReportForm = ({setReportId}) => {
    const [apiErrorMsg, setApiErrorMsg] = React.useState<string>("");

    return (
        <Formik
            onSubmit={(values, actions) => {
                setApiErrorMsg("");
                fetch(`/api/v1/crypto/report`, {
                    method: "POST",
                    body: JSON.stringify({
                        periodStart: values.periodStart.match(/^\d{4}-\d{2}-\d{2}/)?.[0],
                        periodEnd: values.periodEnd.match(/^\d{4}-\d{2}-\d{2}/)?.[0],
                        currency: values.currency,
                        candleInterval: values.candleInterval
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                })
                    .then((response) => {
                        if (!response.ok) {
                            response.json().then((data) => {
                                setApiErrorMsg(data.message);
                            });
                            return;
                        }
                        response.json().then((data) => {
                            setReportId(data.id);
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                actions.setSubmitting(false);
            }}
            initialValues={{
                periodStart: "2018-10-07",
                periodEnd: "2018-10-22",
                currency: "BTC",
                candleInterval: "day"
            }}
            validate={(values) => {
                if (!values.periodStart) {
                    return {periodStart: "required"};
                }
                if (!values.periodEnd) {
                    return {periodEnd: "required"};
                }
                if (!values.currency) {
                    return {currency: "required"};
                }
                if (!values.candleInterval) {
                    return {candleInterval: "required"};
                }

                return null;
            }}
            render={() => (
                <Form>
                    <DatePicker name="periodStart" placeholder="Start date" />
                    <DatePicker name="periodEnd" placeholder="End date" />
                    <Select name="currency" placeholder="Cryptocurrency" style={{width: 150}}>
                        <Select.Option value="BTC">BTC</Select.Option>
                        <Select.Option value="ETH">ETH</Select.Option>
                        <Select.Option value="AVAX">AVAX</Select.Option>
                    </Select>
                    <Select name="candleInterval" placeholder="Candle" style={{width: 150}}>
                        <Select.Option value="hour">Hourly</Select.Option>
                        <Select.Option value="day">Daily</Select.Option>
                        <Select.Option value="week">Weekly</Select.Option>
                        <Select.Option value="month">Monthly</Select.Option>
                    </Select>
                    <SubmitButton type="primary" disabled={false}>
                        Submit
                    </SubmitButton>
                    <br />
                    <br />
                    {apiErrorMsg}
                </Form>
            )}
        />
    );
};
export default ReportForm;
