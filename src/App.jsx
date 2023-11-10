import { Routes, Route } from "react-router";
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


function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />} >
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<ProtectedRoute />} >
        <Route path="createtask" element={<CreateTask />} />
      </Route>

      <Route element={<ProtectedRoute />} >
        <Route path="shoutboard" element={<Shoutboard />} />
      </Route>

      <Route element={<ProtectedRoute />} >
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute />} >
        <Route path="shoutboard/:id" element={<TopicDetails />} />
      </Route>

      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="photoupload" element={<PhotoUpload />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
