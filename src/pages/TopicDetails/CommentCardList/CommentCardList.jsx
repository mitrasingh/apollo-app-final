import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useErrorBoundary } from "react-error-boundary";
import CommentCard from "../CommentCard/CommentCard";
import PropTypes from "prop-types";
import Spinner from 'react-bootstrap/Spinner';

const CommentCardList = ({ isCommentsRefreshed, setIsCommentsRefreshed }) => {
    // useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
    // This shared id also specifies the specific document to query within the "topics" collection of the database
    const { id } = useParams();

    // Stores fetched data from database "comments" sub-collection of document id via fetchComments function
    const [commentsArray, setCommentsArray] = useState([]);
    const sortComments = commentsArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorts comments newest to oldest

    // Catches error and returns to error boundary component (error component in parent (TopicDetailsPage component)
    const { showBoundary } = useErrorBoundary();

    // State for displaying loader component
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsToQuery = query(
                    collection(db, "comments"),
                    where("topicId", "==", id),
                    orderBy("datePosted", "desc")
                );
                const data = await getDocs(commentsToQuery);
                setCommentsArray(
                    data.docs.map((doc) => ({ ...doc.data(), commentId: doc.id }))
                );
            } catch (error) {
                console.log(`Error: ${error.message}`);
                showBoundary(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [isCommentsRefreshed]);

    return (
        <>
            {isLoading ?
                <div className="d-flex justify-content-center align-items-center pt-4">
                    <Spinner animation="border" variant="warning" />
                </div>
                :
                <>
                    {
                        sortComments.map((sortedComment) => {
                            return (
                                <CommentCard
                                    key={sortedComment.commentId}
                                    comment={sortedComment}
                                    setIsCommentsRefreshed={setIsCommentsRefreshed}
                                />
                            );
                        })
                    }
                </>
            }
        </>
    )
}

CommentCardList.propTypes = {
    isCommentsRefreshed: PropTypes.bool.isRequired,
    setIsCommentsRefreshed: PropTypes.func.isRequired
};

export default CommentCardList;