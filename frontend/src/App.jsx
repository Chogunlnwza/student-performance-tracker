import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/teacher"
          element={<TeacherDashboard />}
        />

        <Route
          path="/student"
          element={<StudentDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;