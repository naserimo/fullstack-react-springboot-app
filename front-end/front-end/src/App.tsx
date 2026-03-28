import { Route, Routes } from "react-router-dom";
import CourseTracking from "./assets/components/CourseTracking"; // Import CourseTracking
import Home from "./assets/components/Home";
import Login from "./assets/components/Login"; // Import the Login component
import SignUp from "./assets/components/SignUp";
import Profile from "./assets/components/Profile.tsx"; // Import the SignUp component
import Quiz from "./assets/components/Quiz";
import CoursesPage from "./assets/components/CoursesPage.tsx";
import AdminPage from "./assets/components/AdminPage"; // Import AdminPage
import PdfReaderWithTranslator from "./assets/components/PdfReaderWithTranslator";



function App() {




    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} /> {/* Home page */}

                <Route path="/signup" element={<SignUp />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/quiz/:courseId" element={<Quiz />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/course-tracking/:courseId" element={<CourseTracking />} />
                <Route path="/admin" element={<AdminPage />} /> {/* Admin route */}
                <Route path="/reader/:courseId" element={<PdfReaderWithTranslator />} />

            </Routes>
        </div>
    );
}

export default App;
