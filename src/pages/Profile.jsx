import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Stack, Image } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { editUser } from "../features/user/userSlice"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, updateProfile, updateEmail } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase-config"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useForm } from "react-hook-form";
import { SyncLoader } from 'react-spinners';

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
                }, 1000)
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

    return (
        <>
            {isLoading ? (
                <SyncLoader size={10} cssOverride={spinnerStyle} />
            ) : (
                <Container className="mt-4">
                    <Form onSubmit={handleSubmit(handleUpdate)} noValidate>
                        <Row className="mb-4">
                            <Col xs lg="2">
                                <Stack direction="vertical">
                                    <Image
                                        style={{
                                            height: "180px",
                                            width: "180px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                        src={photoURL}
                                        roundedCircle
                                    />

                                    <Form.Group>
                                        <Form.Control
                                            type="file"
                                            size="sm"
                                            onChange={(event) =>
                                                setUserUpdatedPhoto(event.target.files[0])
                                            }
                                        />
                                    </Form.Group>

                                    <Button
                                        style={{
                                            fontSize: "8px",
                                            maxHeight: "30px",
                                            maxWidth: "75px",
                                        }}
                                        className="ms-5 mt-2"
                                        variant="secondary"
                                        size="sm"
                                        type="file"
                                        onClick={setPhotoHandle}
                                    >
                                        Update Photo
                                    </Button>
                                </Stack>
                            </Col>
                        </Row>

                        <Row>
                            <Stack>
                                <p
                                    className="fw-bold"
                                    style={{ fontSize: "10px", margin: "0px" }}
                                >
                                    First Name
                                </p>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        style={{ fontSize: "10px" }}
                                        type="text"
                                        id="firstname"
                                        {...register("firstname", {
                                            required: {
                                                value: true,
                                                message: "First name is required!",
                                            },
                                        })}
                                    />
                                    <p
                                        style={{
                                            marginTop: "5px",
                                            fontSize: "10px",
                                            color: "red",
                                        }}
                                    >
                                        {errors.firstname?.message}
                                    </p>
                                </Form.Group>

                                <p
                                    className="fw-bold"
                                    style={{ fontSize: "10px", margin: "0px" }}
                                >
                                    Last Name
                                </p>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        style={{ fontSize: "10px" }}
                                        type="text"
                                        id="lastname"
                                        {...register("lastname", {
                                            required: {
                                                value: true,
                                                message: "Last name is required!",
                                            },
                                        })}
                                    />
                                    <p
                                        style={{
                                            marginTop: "5px",
                                            fontSize: "10px",
                                            color: "red",
                                        }}
                                    >
                                        {errors.lastname?.message}
                                    </p>
                                </Form.Group>

                                <p
                                    className="fw-bold"
                                    style={{ fontSize: "10px", margin: "0px" }}
                                >
                                    Title
                                </p>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        style={{ fontSize: "10px" }}
                                        type="text"
                                        id="title"
                                        {...register("title", {
                                            required: {
                                                value: true,
                                                message: "Company title is required!",
                                            },
                                        })}
                                    />
                                    <p
                                        style={{
                                            marginTop: "5px",
                                            fontSize: "10px",
                                            color: "red",
                                        }}
                                    >
                                        {errors.title?.message}
                                    </p>
                                </Form.Group>

                                <p
                                    className="fw-bold"
                                    style={{ fontSize: "10px", margin: "0px" }}
                                >
                                    E-mail
                                </p>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        style={{ fontSize: "10px" }}
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
                                    <p
                                        style={{
                                            marginTop: "5px",
                                            fontSize: "10px",
                                            color: "red",
                                        }}
                                    >
                                        {errors.email?.message}
                                    </p>
                                </Form.Group>
                            </Stack>
                        </Row>

                        <Button
                            style={{ fontSize: "10px", maxHeight: "30px" }}
                            variant="secondary"
                            size="sm"
                            as={Link}
                            to="/"
                        >
                            Cancel
                        </Button>

                        <Button
                            style={{ fontSize: "10px", maxHeight: "30px" }}
                            className="ms-2"
                            variant="primary"
                            size="sm"
                            type="submit"
                        >
                            Save Updates
                        </Button>
                    </Form>
                </Container>
            )}
        </>
    );
};

