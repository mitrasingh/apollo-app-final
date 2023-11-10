import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Stack, Image } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { editUser } from "../features/user/userSlice"
import { useNavigate } from "react-router-dom"
import { getAuth, updateProfile, updateEmail } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase-config"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useForm } from "react-hook-form";
import SyncLoader from 'react-spinners';
import styles from "./Profile.module.css";

export const Profile = () => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    // React Hook Form
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


    const [userUpdatedPhoto, setUserUpdatedPhoto] = useState(""); // Displays photo before final upload
    const [photoURL, setPhotoURL] = useState(""); // Photo URL for HTML display
    const [checkPhoto, setCheckPhoto] = useState(false); // If a new photo exists from previous photo

    const [isLoading, setIsLoading] = useState(false);
    const spinnerStyle = {
        height: "90vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const storage = getStorage();
    const storageRef = ref(storage);

    // Updates form field values to Redux user state values
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
                setPhotoURL(user.userPhoto);
            } catch (error) {
                console.log(error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500)
            }
        };
        fetchUserRedux();
    }, []);

    const setPhotoHandle = async (e) => {
        e.preventDefault();
        try {
            setCheckPhoto(true);
            const imageRef = ref(storageRef, "user-photo/temp");
            await uploadBytes(imageRef, userUpdatedPhoto);
            const getURL = await getDownloadURL(imageRef);
            setPhotoURL(getURL);
        } catch (error) {
            console.log(error.code);
        }
    };

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

            if (checkPhoto) {
                const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
                await uploadBytes(imageRef, userUpdatedPhoto);
                await getDownloadURL(imageRef);
            }

            await updateEmail(auth.currentUser, data.email);

            if (updateProfile || checkPhoto || updateEmail || updateDoc) {
                // Assigns updated values to Redux user state
                dispatch(
                    editUser({
                        userId: user.userId,
                        userPhoto: checkPhoto ? photoURL : user.userPhoto,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        title: data.title,
                        email: data.email,
                    })
                );
            }
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    // Goes to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <>
            {isLoading ? (
                <SyncLoader size={10} color="#ffa500" cssOverride={spinnerStyle} />
            ) : (
                <Container className={`text-light px-4 ${styles.customContainer}`}>
                    <p className="fs-2 fw-bold d-flex justify-content-center text-light">Edit Profile</p>
                    <Form onSubmit={handleSubmit(handleUpdate)} noValidate>
                        <Row className="mb-4">
                            <Col className="d-flex justify-content-center">
                                <Image
                                    className={styles.customImage}
                                    height="105px"
                                    width="105px"
                                    src={photoURL}
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
                                            setUserUpdatedPhoto(event.target.files[0])
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row >

                        <Row>
                            <Col className="mt-3 d-flex justify-content-center">
                                <Button
                                    className={`fs-6 text-light fw-bold ${styles.customBtn}`}
                                    variant="primary"
                                    size="sm"
                                    type="file"
                                    onClick={setPhotoHandle}
                                >
                                    Update Photo
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
                                    className={`fs-6 text-light fw-bold ${styles.customBtn}`}
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className={`ms-2 fs-6 text-light fw-bold ${styles.customBtn}`}
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

