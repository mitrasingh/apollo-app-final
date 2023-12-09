import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Stack, Image } from 'react-bootstrap'
import { useSelector, useDispatch } from "react-redux"
import { editUser } from "../features/user/userSlice"
import { useNavigate } from "react-router-dom"
import { getAuth, updateProfile, updateEmail } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase-config"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useErrorBoundary } from "react-error-boundary";
import Spinner from 'react-bootstrap/Spinner';
import styles from "./ProfileForm.module.css";

const ProfileForm = () => {

    // Allows access to Redux user state
    const user = useSelector((state) => state.user);

    // Redux function which will dispatch actions needed for user state changes
    const dispatch = useDispatch();

    // React Router Dom hook allowing access to different routes
    const navigate = useNavigate();

    // Firebase function that returns the current authorize user of the app
    const auth = getAuth();

    // React Hook Form initial state
    const form = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            title: "",
            email: ""
        }
    });
    const { register, handleSubmit, reset, formState } = form;
    const { errors } = formState;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [userPhoto, setUserPhoto] = useState(user.userPhoto); // State of current photo
    const [userChosenFile, setUserChosenFile] = useState(""); // State variable for users local data of chosen file
    const [isFilePreviewed, setIsFilePreviewed] = useState(false); // Checks if user has previewed their file

    // State for displaying loader component
    const [isLoading, setIsLoading] = useState(true);

    // Allows us access to our firebase storage
    const storage = getStorage();
    const storageRef = ref(storage);

    // Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
    const { showBoundary } = useErrorBoundary();

    // Updates initial form field values to Redux user state values
    useEffect(() => {
        const fetchUserRedux = async () => {
            try {
                setIsLoading(true);
                let defaultValues = {}; // React Hook Form state values 
                defaultValues.firstname = user.firstName;
                defaultValues.lastname = user.lastName;
                defaultValues.title = user.title;
                defaultValues.email = user.email;
                reset({ ...defaultValues });
            } catch (error) {
                console.log(`Error: ${error.message}`);
                showBoundary(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserRedux();
    }, []);

    // Uploads users chosen file to storage as a temporary image
    const setPreviewPhotoHandle = async (e) => {
        e.preventDefault();
        try {
            setIsFilePreviewed(true);
            const imageRef = ref(storageRef, "user-photo/temp");
            await uploadBytes(imageRef, userChosenFile);
            const getURL = await getDownloadURL(imageRef);
            setUserPhoto(getURL);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            toast.error('Sorry, having issues displaying photo!');
        }
    };

    // Sends new data to to database and storage (if user added a new image), updates Redux user state values
    const handleUpdate = async (data) => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: data.firstname,
            });

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                firstname: data.firstname,
                lastname: data.lastname,
                title: data.title,
            });

            if (isFilePreviewed) {
                const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
                await uploadBytes(imageRef, userChosenFile);
                await getDownloadURL(imageRef);
            }

            await updateEmail(auth.currentUser, data.email);

            if (updateProfile || isFilePreviewed || updateEmail || updateDoc) {
                // Assigns updated values to Redux user state
                dispatch(
                    editUser({
                        userId: user.userId,
                        userPhoto: isFilePreviewed ? userPhoto : user.userPhoto,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        title: data.title,
                        email: data.email,
                    })
                );
            }
            toast.success('Your profile has been updated!')
            navigate("/");
        } catch (error) {
            console.log(`Error: ${error.message}`);
            toast.error('Sorry, could not update profile!');
        }
    };

    // Goes to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" variant="warning" />
                </div>
            ) : (
                <Container className={`text-light px-4 ${styles.customContainer}`}>
                    <p className="fs-2 fw-bold d-flex justify-content-center text-light">Edit Profile</p>
                    <Form onSubmit={handleSubmit(handleUpdate)} noValidate>
                        <Row className="mb-4">
                            <Col className="d-flex justify-content-center">
                                <Image
                                    className="object-fit-cover"
                                    height="105px"
                                    width="105px"
                                    src={userPhoto}
                                    roundedCircle
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Form.Group>
                                    <Form.Control
                                        className="fs-6"
                                        type="file"
                                        size="sm"
                                        onChange={(event) =>
                                            setUserChosenFile(event.target.files[0])
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row >

                        <Row>
                            <Col className="mt-3 d-flex justify-content-center">
                                <Button
                                    className={`fs-6 text-light fw-bold ${userChosenFile == 0 ? "disabled" : ""}`}
                                    variant="primary"
                                    size="sm"
                                    type="file"
                                    onClick={setPreviewPhotoHandle}
                                >
                                    Preview Photo
                                </Button>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Stack>
                                <p className="fs-6 fw-bold mb-1">First Name</p>
                                <Form.Group>
                                    <Form.Control
                                        className="fs-6"
                                        type="text"
                                        id="firstname"
                                        {...register("firstname", {
                                            required: {
                                                value: true,
                                                message: "First name is required!",
                                            },
                                        })}
                                    />
                                    <p className="mt-2">{errors.firstname?.message}</p>
                                </Form.Group>

                                <p className="fs-6 fw-bold mb-1 mt-2">Last Name</p>
                                <Form.Group>
                                    <Form.Control
                                        className="fs-6"
                                        type="text"
                                        id="lastname"
                                        {...register("lastname", {
                                            required: {
                                                value: true,
                                                message: "Last name is required!",
                                            },
                                        })}
                                    />
                                    <p className="mt-2">{errors.lastname?.message}</p>
                                </Form.Group>

                                <p className="fs-6 fw-bold mb-1 mt-2">Title</p>
                                <Form.Group>
                                    <Form.Control
                                        className="fs-6"
                                        type="text"
                                        id="title"
                                        {...register("title", {
                                            required: {
                                                value: true,
                                                message: "Company title is required!",
                                            },
                                        })}
                                    />
                                    <p className="mt-2">{errors.title?.message}</p>
                                </Form.Group>

                                <p className="fs-6 fw-bold mb-1 mt-2">E-mail</p>
                                <Form.Group>
                                    <Form.Control
                                        className="fs-6"
                                        type="text"
                                        id="email"
                                        {...register("email", {
                                            required: {
                                                value: true,
                                                message: "Email is required!",
                                            },
                                            pattern: {
                                                value: emailRegex,
                                                message: "Invalid email",
                                            },
                                        })}
                                    />
                                    <p className="mt-2">{errors.email?.message}</p>
                                </Form.Group>
                            </Stack>
                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-end">
                                <Button
                                    className="fs-6 text-light fw-bold"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className="ms-2 fs-6 text-light fw-bold"
                                    variant="primary"
                                    size="sm"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form >
                </Container >
            )}
        </>
    );
};

export default ProfileForm;