import { createUserWithEmailAndPassword, updateProfile, getAuth } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { db } from "../utils/firebase-config"
import { Container, Form, Card, Button } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { loginUser } from "../features/user/userSlice"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";

export const SignUp = () => {

    // React Hook Form
    const form = useForm({ mode: "onChange" });
    const { register, handleSubmit, watch, formState } = form;
    const { errors, isDirty } = formState;
    const watchPassword = watch("password") // Observes password field (to match confirm password)
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth();
    const storage = getStorage();
    const storageRef = ref(storage);
    const handleSignUp = async (data) => {
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(auth.currentUser, {
                displayName: data.firstname,
            });

            const docRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(docRef, {
                firstname: data.firstname, // Allows access for current auth user's name to be available throughout app
                lastname: data.lastname,
                title: data.title,
            })

            const photoRef = ref(storageRef, `user-photo/temporaryphoto.jpeg`);
            const userTempPhotoURL = await getDownloadURL(photoRef);
            // const docRef = doc(db, "users", auth.currentUser.uid)

            const docSnap = await getDoc(docRef);
            if (auth && docSnap.exists()) {
                const fetchUserData = docSnap.data();
                // Assigns default values to Redux user state
                dispatch(
                    loginUser({
                        userId: auth.currentUser.uid,
                        userPhoto: userTempPhotoURL,
                        firstName: auth.currentUser.displayName,
                        lastName: fetchUserData.lastname,
                        title: fetchUserData.title,
                        email: auth.currentUser.email,
                    })
                );
            }
            navigate("/photoupload");
        } catch (error) {
            console.log(error.message)
        }
    };


    return (
        <>
            <Container
                style={{ fontSize: "10px", maxWidth: "400px" }}
                className="mt-4"
            >
                <Form onSubmit={handleSubmit(handleSignUp)} noValidate>
                    <Card className="px-4 py-4">
                        <h4 className="fw-bold d-flex justify-content-center">Sign Up</h4>
                        <p className="d-flex justify-content-center">
                            Already registered?&nbsp;
                            <Link
                                className="link-primary fw-bold"
                                style={{ cursor: "pointer" }}
                                to="/signin"
                            >
                                Sign In
                            </Link>
                        </p>

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            First Name
                        </p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="text"
                                placeholder="Enter first name"
                                {...register("firstname", {
                                    required: {
                                        value: true,
                                        message: "First name is required!"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.firstname?.message}</p>
                        </Form.Group>

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            Last Name
                        </p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="text"
                                placeholder="Enter last name"
                                {...register("lastname", {
                                    required: {
                                        value: true,
                                        message: "Last name is required!"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.lastname?.message}</p>
                        </Form.Group>

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            Title
                        </p>
                        <Form.Group className="mb-3" controlId="progress">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="text"
                                placeholder="Enter your company title"
                                {...register("title", {
                                    required: {
                                        value: true,
                                        message: "Title is required!"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.title?.message}</p>
                        </Form.Group>

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            Email Address
                        </p>
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

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            Password
                        </p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="password"
                                placeholder="Enter password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required!"
                                    },
                                    minLength: {
                                        value: 6,
                                        message: "Password must have at least 6 characters"
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.password?.message}</p>
                        </Form.Group>

                        <p
                            className="fw-bold mb-1"
                            style={{ fontSize: "10px", margin: "0px" }}
                        >
                            Confirm Password
                        </p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                style={{ fontSize: "10px" }}
                                type="password"
                                placeholder="Enter password again"
                                {...register("passwordconfirm", {
                                    required: {
                                        value: true,
                                        message: "Password is required!"
                                    },
                                    validate: {
                                        passwordMatch: (fieldValue) => {
                                            return fieldValue === watchPassword || "The passwords do not match"
                                        }
                                    }
                                })}
                            />
                            <p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>{errors.passwordconfirm?.message}</p>
                        </Form.Group>

                        <Button
                            style={{ fontSize: "10px", maxHeight: "30px" }}
                            variant="primary"
                            size="sm"
                            type="submit"
                            disabled={!isDirty}
                        >
                            Sign Up
                        </Button>

                        <Button
                            style={{ fontSize: "10px", maxHeight: "30px" }}
                            variant="secondary"
                            className="mt-2"
                            size="sm"
                            as={Link}
                            to="/signin"
                        >
                            Back to Sign In
                        </Button>

                        <Link
                            className="d-flex justify-content-center link-primary mt-3"
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
