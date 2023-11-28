import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
import TaskCard from "../components/TaskCard";


const TaskCards = ({ setTaskArray, setTaskArrayFilter, taskArrayFilter, refreshTasksHandle }) => {

    // State for displaying loader component
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data and map each task into state variables
    const fetchTasks = async () => {
        try {
            const dbRef = collection(db, "tasks");
            const fetchTasks = await getDocs(query(dbRef));
            const tasksMap = fetchTasks.docs.map((doc) => ({
                ...doc.data(),
                taskId: doc.id,
            }));
            setTaskArray(tasksMap);
            setTaskArrayFilter(tasksMap);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);


    return (
        <>
            {isLoading ?
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" variant="warning" />
                </div>
                :
                <>
                    {taskArrayFilter.map((task) => {
                        return (
                            <TaskCard
                                refreshTasksHandle={refreshTasksHandle}
                                task={task}
                                key={task.taskId}
                            />
                        );
                    })}
                </>
            }
        </>
    )
};

TaskCards.propTypes = {
    setTaskArray: PropTypes.func.isRequired,
    setTaskArrayFilter: PropTypes.func.isRequired,
    taskArrayFilter: PropTypes.array.isRequired,
    refreshTasksHandle: PropTypes.func.isRequired,
};

export default TaskCards;