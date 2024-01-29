import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { store } from './store/store';
// import { ToastContainer } from 'react-toastify';
import ToastContainerCondition from "../src/components/ToastContainerCondition/ToastContainerCondition";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainerCondition />
      {/* <ToastContainer
        className="fs-5 mt-4"
        position="bottom-center"
        autoClose={2500}
        hideProgressBar={false}
        theme="dark"
        closeOnClick
      /> */}
    </Provider>
  </React.StrictMode>
)


