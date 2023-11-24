import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { TopicIdContext } from "../utils/TopicIdContext";
import { CommentCard } from "../components/CommentCard";
import PropTypes from "prop-types";

const Comments = ({ isCommentsRefreshed, setIsCommentsRefreshed }) => {
    // useParams, creates a dynamic page using the topicId property from its fetched document within the "topics" collection in database
    // This shared id also specifies the specific document to query within the "topics" collection of the database
    const { id } = useParams();

    // Stores fetched data from database "comments" sub-collection of document id via fetchComments function
    const [commentsArray, setCommentsArray] = useState([]);
    const sortComments = commentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

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
                console.log(error);
            }
        };
        fetchComments();
    }, [isCommentsRefreshed]);

    return (
        <>
            {sortComments.map((sortedComment) => {
                return (
                    <TopicIdContext.Provider value={{ id, setIsCommentsRefreshed }} key={sortedComment.commentId}>
                        <CommentCard comment={sortedComment} />
                    </TopicIdContext.Provider>
                );
            })}
        </>
    )
}

Comments.propTypes = {
    isCommentsRefreshed: PropTypes.bool.isRequired,
    setIsCommentsRefreshed: PropTypes.func.isRequired
};

export default Comments;