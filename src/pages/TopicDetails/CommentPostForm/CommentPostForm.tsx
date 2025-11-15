import { useEffect } from "react";
import { Col, Row, Form, Button, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { RootState } from "../../../store/store";
// import { CommentPostData } from "../../../types/commentdata.types";

type CommentFormValues = {
	userComment: string;
};

type CommentPostFormProps = {
	setIsCommentsRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentPostForm = ({ setIsCommentsRefreshed }: CommentPostFormProps) => {
	// useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
	// This shared id also specifies the specific document to query within the "topics" collection of the database
	const { id } = useParams();

	// React hook form
	const form = useForm<CommentFormValues>();
	const { register, handleSubmit, reset, formState } = form;
	const { errors, isSubmitSuccessful } = formState;

	// Redux state properties of current user
	const currentUser = useSelector((state: RootState) => state.user);

	// Adds a document to "comments" subcollection within firestore database ("topics"/specific ID/"comments"/ADDED DOCUMENT)
	const handlePostCommentButton = async (data: CommentFormValues) => {
		const myDate = new Date();
		const postTimeStamp = Timestamp.fromDate(myDate);
		try {
			await addDoc(collection(db, "comments"), {
				userId: currentUser.userId,
				userPhoto: currentUser.userPhoto,
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				userComment: data.userComment,
				datePosted: postTimeStamp,
				topicId: id,
				isDocEdited: false, // Must be false on initial creation of comment
			});
			setIsCommentsRefreshed((current) => !current);
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, could not post comment!");
		}
	};

	// Resets form field values
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<Container className="mt-4">
			<Form className="mt-3 text-light" onSubmit={handleSubmit(handlePostCommentButton)} noValidate>
				<Form.Group controlId="commentInput">
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
						{...register("userComment", {
							required: {
								value: true,
								message: "Post cannot be empty!",
							},
						})}
					/>
					<p className="mt-2 fs-6">{errors.userComment?.message}</p>
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
		</Container>
	);
};

CommentPostForm.propTypes = {
	setIsCommentsRefreshed: PropTypes.func.isRequired,
};

export default CommentPostForm;
