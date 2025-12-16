import { Card, Col, Container, Row, Image, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { convertToRelativeTime } from "../../../utils/date-config";
import styles from "./TopicCard.module.css";
import { TopicData } from "../../../types/topicdata.types";
import { useUserPhoto } from "../../../hooks/useUserPhoto";
import { useCommentCount } from "../../../hooks/useCommentCount";

type TopicCardProps = {
	topic: TopicData;
};

export const TopicCard = ({ topic }: TopicCardProps) => {
	const creatorPhoto = useUserPhoto(topic.userId);
	const numOfComments = useCommentCount(topic.topicId);

	const dateRelativeTime = convertToRelativeTime(topic.datePosted);

	return (
		<Container className="mt-3">
			<Card className={styles.customCard}>
				<Card.Header>
					<Row>
						<Col>
							<Link to={`/topicboard/${topic.topicId}`}>
								<Card.Text className="fw-bold fs-5 text-truncate">{topic.title}</Card.Text>
							</Link>
						</Col>
					</Row>
				</Card.Header>

				<Card.Body className="fs-6">
					<Row>
						<Col xs={5}>
							<Stack direction="horizontal" gap={2}>
								<Image className="object-fit-cover" height="35px" width="35px" src={creatorPhoto} roundedCircle />
								<Stack direction="vertical">
									<Card.Text className="my-0">by:</Card.Text>
									<Card.Text className="my-0 fw-bold">
										{topic.firstName} {topic.lastName}
									</Card.Text>
								</Stack>
							</Stack>
						</Col>

						<Col xs={4} className={styles.mobileHidden}>
							<Card.Text className="my-0">{topic.isDocEdited ? `Post edited` : `Posted`}</Card.Text>
							<Card.Text className="my-0">{dateRelativeTime}</Card.Text>
						</Col>

						<Col xs={3}>
							<Stack direction="horizontal" gap={2} className="mt-1">
								<Image src="/comments.svg" width="18" height="18" alt="comments icon" />
								<Card.Text>
									{numOfComments} {numOfComments === 1 ? "Reply" : "Replies"}
								</Card.Text>
							</Stack>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default TopicCard;
