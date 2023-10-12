import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Stack, Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export const ForgotPassword = () => {
    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const [modalAlertMessage, setModalAlertMessage] = useState("A link will be sent to your email");

    const handleForgotPassword = async (data) => {
        const auth = getAuth();
        try {
            const inputEmailData = data.email;
            await sendPasswordResetEmail(auth, inputEmailData);
            setModalAlertMessage("Email has been sent!");
        } catch (error) {
            setModalAlertMessage(error.message);
            console.log(error);
        }
    };

    return (
        <Container style={{ fontSize: "10px", maxWidth: "400px" }} className="mt-4">
            <Form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
                <Modal.Body>
                    <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
                        <Modal.Title>Forgot your password?</Modal.Title>
                    </Modal.Header>

                    <p
                        style={{
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "5px",
                        }}
                    >
                        {modalAlertMessage}
                    </p>

                    <Form.Group>
                        <Form.Control
                            style={{ fontSize: "10px" }}
                            type="text"
                            placeholder="Email"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email is required to reset your password!",
                                },
                                pattern: {
                                    value: emailRegex,
                                    message: "Email is not valid!",
                                },
                            })}
                        />
                        <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
                            {errors.email?.message}
                        </p>
                    </Form.Group>

                    <Modal.Footer>
                        <Stack>
                            {modalAlertMessage === "Email has been sent!" ? null : (
                                <Button
                                    style={{ fontSize: "10px", maxHeight: "30px" }}
                                    className="ms-2"
                                    variant="primary"
                                    size="sm"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            )}

                            {modalAlertMessage === "Email has been sent!" ? (
                                <Button
                                    style={{ fontSize: "10px", maxHeight: "30px" }}
                                    className="ms-2"
                                    variant="primary"
                                    size="sm"
                                    as={Link}
                                    to="/"
                                >
                                    Back To Sign In
                                </Button>
                            ) : (
                                <Button
                                    style={{ fontSize: "10px", maxHeight: "30px" }}
                                    className="ms-2 mt-2"
                                    variant="secondary"
                                    size="sm"
                                    as={Link}
                                    to="/"
                                >
                                    Back To Sign In
                                </Button>
                            )}
                        </Stack>
                    </Modal.Footer>
                </Modal.Body>
            </Form>
        </Container>
    );
};
