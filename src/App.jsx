import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home";
import CreateTaskPage from "./pages/CreateTaskPage";
import TopicBoard from "./pages/TopicBoard"
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PhotoUpload } from "./pages/PhotoUpload";
import TopicDetailsPage from "./pages/TopicDetailsPage";
import { ForgotPassword } from "./pages/ForgotPassword";
import { NotFound } from "./pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="createtask" element={<CreateTaskPage />} />
        <Route path="profile" element={<Profile />} />
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
