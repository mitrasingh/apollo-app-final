import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainerCondition = () => {
    const isMobile = window.innerWidth <= 600;
    const toastPosition = isMobile ? 'bottom-center' : 'top-right';
    return (
        <ToastContainer
            className="fs-5 mt-4"
            position={toastPosition}
            autoClose={2500}
            hideProgressBar={false}
            theme="dark"
            closeOnClick
        />
    );
};

export default ToastContainerCondition;