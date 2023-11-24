import { useEffect } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";

const CommentPostForm = ({ setIsCommentsRefreshed }) => {
    // useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
    // This shared id also specifies the specific document to query within the "topics" collection of the database
    const { id } = useParams();

    // React hook form
    const form = useForm();
    const { register, handleSubmit, reset, formState } = form;
    const { errors, isSubmitSuccessful } = formState;

    // Redux state properties of current user (sets default properties when posting a comment)
    const currentUser = useSelector((state) => state.user);

    // Adds a document to "comments" subcollection within firestore database ("topics"/specific ID/"comments"/ADDED DOCUMENT)
    const handlePostCommentButton = async (data) => {
        const myDate = new Date();
        const postTimeStamp = Timestamp.fromDate(myDate);
        try {
            await addDoc(collection(db, "comments"), {
                userId: currentUser.userId,
                userPhoto: currentUser.userPhoto,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                userComment: data.postcomment,
                datePosted: postTimeStamp,
                topicId: id,
            });
            setIsCommentsRefreshed((current) => !current);
            toast.success('Comment has been posted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (error) {
            console.log(error);
            toast.success('Sorry, could not post comment!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    // Resets form field values
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <Form
            className="mt-3 text-light"
            onSubmit={handleSubmit(handlePostCommentButton)}
            noValidate
        >
            <Form.Group>
                <Form.Label className="fs-6">
                    comment as {currentUser.firstName} {currentUser.lastName}
                </Form.Label>
                <Form.Control
                    className="fs-5"
                    maxLength={2000}
                    rows={5}
                    type="text"
                    as="textarea"
                    placeholder="What are your thoughts?"
                    {...register("postcomment", {
                        required: {
                            value: true,
                            message: "Post cannot be empty!",
                        },
                    })}
                />
                <p className="mt-2 fs-6">{errors.postcomment?.message}</p>
            </Form.Group>
            <Row>
                <Col className="d-flex justify-content-end">
                    <Button
                        className="d-flex align-items-center fs-6 fw-bold text-light"
                        variant="primary"
                        size="sm"
                        type="submit"
                    >
                        Post
                    </Button>
                </Col>
            </Row>
        </Form>
    )
};

CommentPostForm.propTypes = {
    setIsCommentsRefreshed: PropTypes.func.isRequired,
};

export default CommentPostForm;