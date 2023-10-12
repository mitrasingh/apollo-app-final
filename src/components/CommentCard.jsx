import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useContext, useState } from "react";
import { TopicIdContext } from "../utils/TopicIdContext";
import { EditComment } from "../components/EditComment";
import { Like } from "../components/Like";
import { Container, Row, Col, Stack, Image, Card, Dropdown } from "react-bootstrap";
import { DeleteModal } from "../components/DeleteModal";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const CommentCard = (props) => {
	// Props from parent TopicDetails.jsx
	const { comment } = props;

	// Data of currently logged in user from Redux state
	const currentUser = useSelector((state) => state.user);

	// Data from useContext from TopicDetails.jsx
	const { setIsCommentsRefreshed } = useContext(TopicIdContext); // TopicIdContext consists of id and setIsCommentsRefreshed

	// Display edit field for the comment when set to true
	const [isEditComment, setIsEditComment] = useState(false);

	// Confirms user submitted change to comment when set to true
	const [isCommentUpdated, setIsCommentUpdated] = useState(false);

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
			console.log(error);
		}
	};

	// Conversion of firestore timestamp to dayjs fromNow method
	dayjs.extend(relativeTime);
	const convertTimeStamp = comment.datePosted.toDate();
	const dateRelativeTime = dayjs(convertTimeStamp).fromNow();

	return (
		<Container className="mt-4">
			<Card style={{ padding: "10px" }}>
				<Row>
					<Col>
						<Stack direction="horizontal" gap={2}>
							<Image
								style={{
									height: "25px",
									width: "25px",
									objectFit: "cover",
									borderRadius: "50%",
								}}
								src={comment.userPhoto}
								roundedCircle
							/>
							<p style={{ fontSize: "9px", marginTop: "12px" }}>{comment.firstName} {comment.lastName}</p>
							<p style={{ fontSize: "8px", marginTop: "12px" }}>
								{isCommentUpdated
									? `post edited `
									: `posted `}{dateRelativeTime}
							</p>

							{/* Code below is a ternary operator nested into another ternary operator */}
							{comment.userId === currentUser.userId
								? (
									<Dropdown>
										<Dropdown.Toggle
											style={{ maxHeight: "20px" }}
											className="d-flex align-items-center"
											split
											variant="dark"
											id="dropdown-split-basic"
										></Dropdown.Toggle>

										<Dropdown.Menu style={{ fontSize: "10px" }}>
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
						</Stack>

						{isEditComment
							?
							<EditComment
								userComment={comment.userComment}
								setIsEditComment={setIsEditComment}
								commentId={comment.commentId}
								setIsCommentUpdated={setIsCommentUpdated}
							/>
							:
							<Stack className="mt-2">
								<Row>
									<Col>
										<p style={{ fontSize: "11px" }}>{comment.userComment}</p>
									</Col>
								</Row>
							</Stack>
						}
						<Like docId={comment.commentId} />
					</Col>
				</Row>
			</Card>
		</Container>
	);
};

CommentCard.propTypes = {
	comment: PropTypes.shape({
		userId: PropTypes.string.isRequired,
		userPhoto: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		userComment: PropTypes.string.isRequired,
		datePosted: PropTypes.object.isRequired,
		topicId: PropTypes.string.isRequired,
		commentId: PropTypes.string.isRequired
	})
};
