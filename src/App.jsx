import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateTaskPage from "./pages/CreateTask/CreateTaskPage";
import TopicBoard from "./pages/TopicBoard/TopicBoard"
import EditProfilePage from "./pages/EditProfile/EditProfilePage"
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PhotoUpload from "./pages/PhotoUpload/PhotoUpload";
import TopicDetailsPage from "./pages/TopicDetails/TopicDetailsPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NotFound from "./pages/NotFound/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="createtask" element={<CreateTaskPage />} />
        <Route path="editprofile" element={<EditProfilePage />} />
        <Route path="topicboard" element={<TopicBoard />} />
        <Route path="topicboard/:id" element={<TopicDetailsPage />} />
      </Route>

      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="photoupload" element={<PhotoUpload />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
