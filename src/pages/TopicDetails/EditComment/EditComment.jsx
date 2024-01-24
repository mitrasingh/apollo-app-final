import { Form, Stack, Button, Row, Col } from "react-bootstrap";
import { db } from "../../../utils/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import useDateConverter from "../../../hooks/useDateConverter";
import PropTypes from "prop-types";

const EditComment = ({ userComment, setIsEditComment, commentId, setIsCommentsRefreshed }) => { // Props from CommentCard.jsx

	// React Hook Form
	const form = useForm({
		defaultValues: {
			editcomment: userComment
		}
	})
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	// Custom hook converts current date/time as a firestore timestamp
	const { createTimestamp } = useDateConverter();

	// Updates comment document in database and refreshes comment card
	const handleUpdateButton = async (data) => {
		try {
			const timestamp = createTimestamp();
			const docRef = doc(db, "comments", commentId);
			await updateDoc(docRef, {
				userComment: data.editcomment,
				datePosted: timestamp,
				isDocEdited: true
			});
			setIsEditComment(false); // Hides display of edit component
			setIsCommentsRefreshed((current) => !current); // Refreshes topic for immediate update
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error('Sorry, could not edit your comment!');
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
	commentId: PropTypes.string.isRequired,
	setIsEditComment: PropTypes.func.isRequired,
	setIsCommentsRefreshed: PropTypes.func.isRequired,
};

export default EditComment;