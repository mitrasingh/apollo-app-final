import { Form, Stack, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { useContext } from "react";
import { db } from "../utils/firebase-config";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { TopicIdContext } from "../utils/TopicIdContext";
import { useForm } from "react-hook-form";

export const EditComment = ({ userComment, setIsEditComment, commentId, setIsCommentUpdated }) => { // Props from CommentCard.jsx

	// Data from useContext from TopicDetails.jsx
	const { setIsCommentsRefreshed } = useContext(TopicIdContext); // TopicIdContext also has a prop of id

	// React Hook Form
	const form = useForm({
		defaultValues: {
			editcomment: userComment
		}
	})
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	// Updates comment document in database and refreshes comment card
	const handleUpdateButton = async (data) => {
		const myDate = new Date();
		const postTimeStamp = Timestamp.fromDate(myDate);
		try {
			const docRef = doc(db, "comments", commentId);
			await updateDoc(docRef, {
				userComment: data.editcomment,
				datePosted: postTimeStamp
			});
			setIsEditComment(false); // Hides display of edit component
			setIsCommentsRefreshed((current) => !current); // Refreshes topic for immediate update
			setIsCommentUpdated((current) => !current); // Updates timestamp
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Form className="mt-1" onSubmit={handleSubmit(handleUpdateButton)} noValidate>
				<Form.Group className="mb-3">
					<Form.Control
						className="fs-5"
						maxLength={100000}
						rows={5}
						type="text"
						as="textarea"
						placeholder="What are your thoughts?"
						{...register("editcomment", {
							required: {
								value: true,
								message: "This field cannot be empty!"
							}
						})}
					/>
				</Form.Group>
				<Row>
					<Col className="d-flex justify-content-end">
						<Stack direction="horizontal" gap={1}>
							<Button
								className="fs-6 text-light fw-bold"
								variant="secondary"
								size="sm"
								type="submit"
								onClick={() => setIsEditComment(false)}
							>
								Cancel
							</Button>
							<Button
								className="ms-2 fs-6 text-light fw-bold"
								variant="primary"
								size="sm"
								type="submit"
							>
								Update
							</Button>
						</Stack>
					</Col>
				</Row>
				<p className="mt-2 fs-6 d-flex justify-content-end">{errors.editcomment?.message}</p>
			</Form>

		</>
	);
};

EditComment.propTypes = {
	userComment: PropTypes.string.isRequired,
	commentId: PropTypes.object.isRequired,
	setIsEditComment: PropTypes.func.isRequired,
	setIsCommentUpdated: PropTypes.func.isRequired,
};
