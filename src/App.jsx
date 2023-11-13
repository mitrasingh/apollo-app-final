import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { CreateTask } from "./pages/CreateTask";
import { Profile } from "./pages/Profile";
import { Shoutboard } from "./pages/Shoutboard";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PhotoUpload } from "./pages/PhotoUpload";
import { TopicDetails } from "./pages/TopicDetails";
import { ForgotPassword } from "./pages/ForgotPassword";
import { NotFound } from "./pages/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="createtask" element={<CreateTask />} />
        <Route path="shoutboard" element={<Shoutboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="shoutboard/:id" element={<TopicDetails />} />
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
