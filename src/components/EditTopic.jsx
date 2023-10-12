import { Form, Stack, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { db } from "../utils/firebase-config";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";

// Props from TopicDetails.jsx
export const EditTopic = ({ setIsEditTopicDisplayed, description, id, setIsTopicRefreshed, setIsTopicEdited }) => {

	// React Hook Form
	const form = useForm({
		defaultValues: {
			newdescription: description,
		},
	});
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	// Updates topic document in database and refreshes topic description
	const handleEditTopic = async (data) => {
		try {
			const myDate = new Date();
			const postTimeStamp = Timestamp.fromDate(myDate);
			const docRef = doc(db, "topics", id);
			await updateDoc(docRef, {
				description: data.newdescription,
				datePosted: postTimeStamp
			});
			if (updateDoc) {
				setIsEditTopicDisplayed(false); // Hides display of edit component
				setIsTopicRefreshed((current) => !current); // Refreshes topic for immediate update
				setIsTopicEdited((current) => !current); // Updates timestamp
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Form
				className="mt-4"
				onSubmit={handleSubmit(handleEditTopic)}
				noValidate
			>
				<Form.Group className="mb-3">
					<Form.Control
						style={{ fontSize: "10px" }}
						maxLength={100000}
						rows={5}
						type="text"
						as="textarea"
						{...register("newdescription", {
							required: {
								value: true,
								message: "Description of task is required!",
							},
						})}
					/>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.newdescription?.message}
					</p>
				</Form.Group>

				<Stack direction="horizontal" gap={1}>
					<Button
						style={{ fontSize: "10px", maxHeight: "30px", minWidth: "40px" }}
						className="ms-2"
						variant="dark"
						size="sm"
						onClick={() => setIsEditTopicDisplayed(false)}
					>
						Cancel
					</Button>
					<Button
						style={{ fontSize: "10px", maxHeight: "30px", minWidth: "40px" }}
						className="ms-2"
						variant="dark"
						size="sm"
						type="submit"
					>
						Update
					</Button>
				</Stack>
			</Form>
		</>
	);
};

EditTopic.propTypes = {
	description: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	setIsEditTopicDisplayed: PropTypes.func.isRequired,
	setIsTopicRefreshed: PropTypes.func.isRequired,
	setIsTopicEdited: PropTypes.func.isRequired
};
