import { Button, Card, Container, Form, Stack, Image } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import styles from "./SignIn.module.css";

export const SignIn = () => {

    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    // Login functionality that uses form data from user fields entered
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
            toast.info("Welcome to Apollo!");
            navigate("/");
        } catch (error) {
            if (error.message.includes("user-not-found")) {
                toast.error("User not found!")
            } else if (error.message.includes("wrong-password")) {
                toast.error("Password is incorrect!")
            } else {
                toast.error("Sorry, we are having some technical issues!")
            }
            console.log(`Error: ${error.message}`);
        }
    };

    // Login functionality with set parameters for guest
    const handleGuestLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, "guest@apollo.com", "guest123");
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
            toast.info("Welcome to Apollo!");
            navigate("/");
        } catch (error) {
            toast.error("Sorry, we are having some technical issues!")
            console.log(`Error: ${error.message}`);
        }
    };

    return (
        <Container className={`text-light fs-6 ${styles.customContainer}`}>
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
                <Card className="mt-4 p-4 text-light" >
                    <h4 className="fw-bold text-center">Sign In</h4>
                    <p className="text-center">
                        Not registered?&nbsp;
                        <Link
                            className="fw-bold"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </p>

                    <p className="fw-bold mb-1">Email Address</p>
                    <Form.Group className="mb-2">
                        <Form.Control
                            className="shadow-none fs-6"
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
                            className="shadow-none fs-6"
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
                        className="mt-3 text-center"
                        as={Link}
                        to="/forgotpassword"
                    >
                        Forgot password?
                    </Link>
                </Card>
            </Form>
            <p className="text-center mt-4">
                Sign In as {" "}
                <Link className="fw-bold" onClick={handleGuestLogin}>
                    Guest
                </Link>
            </p>
        </Container >
    );
};
