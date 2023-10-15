import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Stack, Form, Modal, Button, Image } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../pages/ForgotPassword.css";

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
        <Container className="formContainer">
            <Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
                <Image
                    src="public/img/rocket_white.svg"
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="apollo logo"
                />
                <h1 className="fw-bold">Apollo</h1>
            </Stack>
            <Form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
                <Modal.Body>
                    <Modal.Header>
                        <Modal.Title className="textHeaderStyle mt-4">Forgot your password?</Modal.Title>
                    </Modal.Header>

                    <p className="modalAertMessage text-center"> {modalAlertMessage} </p>

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
                                    className="ms-2 buttonPrimary"
                                    size="sm"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            )}

                            {modalAlertMessage === "Email has been sent!" ? (
                                <Button
                                    style={{ fontSize: "10px", maxHeight: "30px" }}
                                    className="ms-2 buttonPrimary"
                                    size="sm"
                                    as={Link}
                                    to="/"
                                >
                                    Back To Sign In
                                </Button>
                            ) : (
                                <Button
                                    style={{ fontSize: "10px", maxHeight: "30px" }}
                                    className="ms-2 mt-2 buttonSecondary"
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
