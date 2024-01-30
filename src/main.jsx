import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ToastContainerCondition from "./components/ToastContainerCondition/ToastContainerCondition";
import { Provider } from 'react-redux';
import { store } from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainerCondition />
    </Provider>
  </React.StrictMode>
)


