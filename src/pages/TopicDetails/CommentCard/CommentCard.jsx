import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useState } from "react";
// import { TopicIdContext } from "../utils/TopicIdContext";
import { Row, Col, Stack, Image, Card, Dropdown } from "react-bootstrap";
import { EditComment } from "../EditComment/EditComment";
import { Like } from "../../../components/Like";
import DeleteModal from "../../../components/DeleteModal";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const CommentCard = ({ comment, setIsCommentsRefreshed }) => { // Props from parent Comments.jsx

	// Data of currently logged in user from Redux state
	const currentUser = useSelector((state) => state.user);

	// Display edit field for the comment when set to true
	const [isEditComment, setIsEditComment] = useState(false);

	// Delete comment functionality
	const [isVisible, setIsVisible] = useState(false); // Modal display state to confirm delete
	const handleShow = () => setIsVisible(true); // Renders modal display if true
	const handleDeleteComment = async () => {
		try {
			const commentRef = doc(db, "comments", comment.commentId);
			await deleteDoc(commentRef);
			setIsCommentsRefreshed((current) => !current);
			setIsVisible(false);
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}
	};

	// Conversion of firestore timestamp to dayjs fromNow method
	dayjs.extend(relativeTime);
	const convertTimeStamp = comment.datePosted.toDate();
	const dateRelativeTime = dayjs(convertTimeStamp).fromNow();

	return (
		<>
			<Card className="mt-4 p-1 text-light">
				<Card.Header>
					<Row>
						<Col className="d-flex align-items-center">
							<Stack direction="horizontal" gap={2}>
								<Image
									className="object-fit-cover"
									height="25px"
									width="25px"
									src={comment.userPhoto}
									roundedCircle
								/>
								<Card.Text className="fs-6">
									{comment.firstName} {comment.lastName}
								</Card.Text>
							</Stack>
						</Col>
						<Col className="d-flex justify-content-end">
							{/* Code below is a ternary operator nested into another ternary operator */}
							{comment.userId === currentUser.userId
								? (
									<Dropdown className="fs-6 mt-1">
										<Dropdown.Toggle
											className="d-flex align-items-center text-light"
											split
											variant="primary"
											id="dropdown-split-basic"
										></Dropdown.Toggle>

										<Dropdown.Menu>
											<Dropdown.Item onClick={() => setIsEditComment(true)}>
												Edit
											</Dropdown.Item>
											<Dropdown.Item onClick={handleShow}>Delete</Dropdown.Item>
											{isVisible
												? <DeleteModal
													handleDelete={handleDeleteComment}
													setIsVisible={setIsVisible}
													isVisible={isVisible}
													type={"comment"}
												/>
												: null}
										</Dropdown.Menu>
									</Dropdown>
								)
								: null}
						</Col>
					</Row>
				</Card.Header>

				<Card.Body>
					{isEditComment
						?
						<EditComment
							userComment={comment.userComment}
							setIsEditComment={setIsEditComment}
							commentId={comment.commentId}
							setIsCommentsRefreshed={setIsCommentsRefreshed}
						/>
						:
						<Row>
							<Col>
								<p className="fs-5">{comment.userComment}</p>
							</Col>
						</Row>
					}
				</Card.Body>
				<Card.Body className="py-0">
					<Row>
						<Col>
							<Like docId={comment.commentId} />
						</Col>
						<Col>
							<Card.Text className="fs-6 py-0 pt-3 d-flex justify-content-end">
								{comment.isDocEdited
									? ` post edited `
									: ` posted `}{dateRelativeTime}
							</Card.Text>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	);
};

CommentCard.propTypes = {
	setIsCommentsRefreshed: PropTypes.func.isRequired,
	comment: PropTypes.shape({
		userId: PropTypes.string.isRequired,
		userPhoto: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		userComment: PropTypes.string.isRequired,
		datePosted: PropTypes.object.isRequired,
		topicId: PropTypes.string.isRequired,
		commentId: PropTypes.string.isRequired,
		isDocEdited: PropTypes.bool.isRequired
	})
};
