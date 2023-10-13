import { useState } from "react";
import { Button, Card, Container, Form, Alert } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useForm } from "react-hook-form";

export const SignIn = () => {
    // Invokes error message if login fails
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors, isDirty } = formState;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const auth = getAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data();
            // Assigns default values to Redux user state
            dispatch(
                loginUser({
                    userId: auth.currentUser.uid,
                    firstName: auth.currentUser.displayName,
                    lastName: userData.lastname,
                    title: userData.title,
                    email: auth.currentUser.email,
                })
            );
            navigate("/");
        } catch (error) {
            setAlert(true);
            setAlertMessage(error.code);
        }
    };

    return (
        <>
            {alert ? (
                <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                    <Alert.Heading>There is an error!</Alert.Heading>
                    <p>Reason: {alertMessage}</p>
                </Alert>
            ) : null}

            <Container
                style={{ fontSize: "10px", maxWidth: "400px" }}
                className="mt-4"
            >
                <Form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <Card className="px-4 py-4 myCard">
                        <h4 className="fw-bold d-flex justify-content-center">Sign In</h4>
                        <p className="d-flex justify-content-center">
                            Not registered?&nbsp;
                            <Link
                                className="link-primary fw-bold myLink"
                                style={{ cursor: "pointer" }}
                                to="/signup"
                            >
                                Sign Up
                            </Link>
                        </p>

                        <p className="fw-bold mb-1" style={{ fontSize: "10px", margin: "0px" }}>Email Address</p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="text"
                                placeholder="Enter email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required!"
                                    },
                                    pattern: {
                                        value: emailRegex,
                                        message: "Invalid email format!"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.email?.message}</p>
                        </Form.Group>

                        <p className="fw-bold mb-1" style={{ fontSize: "10px", margin: "0px" }}>Password</p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="password"
                                placeholder="Enter password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required!"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.password?.message}</p>
                        </Form.Group>

                        <Button
                            style={{ fontSize: "10px", maxHeight: "30px" }}
                            className="buttonPrimary"
                            size="sm"
                            type="submit"
                            disabled={!isDirty}
                        >
                            Login
                        </Button>

                        <Link
                            className="d-flex justify-content-center link-primary mt-3 myLink"
                            as={Link}
                            to="/forgotpassword"
                        >
                            Forgot password?
                        </Link>

                    </Card>
                </Form>
            </Container>
        </>
    );
};
