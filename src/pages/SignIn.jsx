import { useState } from "react";
import { Button, Card, Container, Form, Alert, Stack, Image } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useForm } from "react-hook-form";
import styles from "./SignIn.module.css";

export const SignIn = () => {
    // Invokes error message if login fails
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
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

            <Container className={styles.customContainer}>
                <h6 className="text-center">Welcome to</h6>
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
                <Form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <Card className={`mt-4 p-4 ${styles.customCard}`} >
                        <h4 className="fw-bold text-center">Sign In</h4>
                        <p className="text-center">
                            Not registered?&nbsp;
                            <Link
                                className={`fw-bold text-decoration-none ${styles.customLink}`}
                                style={{ cursor: "pointer" }}
                                to="/signup"
                            >
                                Sign Up
                            </Link>
                        </p>

                        <p className="fw-bold mb-1">Email Address</p>
                        <Form.Group className="mb-2">
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
                            <p className="mt-2">{errors.email?.message}</p>
                        </Form.Group>

                        <p className="fw-bold mb-1">Password</p>
                        <Form.Group className="mb-2">
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
                            <p className="mt-2">{errors.password?.message}</p>
                        </Form.Group>

                        <Button
                            className="fw-bold text-light fs-5"
                            variant="primary"
                            size="sm"
                            type="submit"
                        >
                            Login
                        </Button>

                        <Link
                            className={`text-decoration-none mt-3 text-center ${styles.customLink}`}
                            as={Link}
                            to="/forgotpassword"
                        >
                            Forgot password?
                        </Link>

                    </Card>
                </Form>
            </Container >
        </>
    );
};
