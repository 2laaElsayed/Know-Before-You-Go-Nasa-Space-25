import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserContextProvider from "./Components/Context/UserContext";
import ProtectedRouting from "./Components/ProtectedRouting/ProtectedRouting";

import Home from "./Components/Home/Home.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import VerifyEmail from "./Components/Register/VerifyEmail.jsx";
import ForgetPassword from "./Components/Login/ForgetPassword.jsx";
import ResetPassword from "./Components/Login/ResetPassword.jsx";
import NotFound from "./Components/NotFound/NotFound.jsx";
import MainLayout from "./Components/Layout/MainLayout.jsx";
import AddEvent from "./Components/Event/AddEvent.jsx";
import EventDetails from "./Components/Event/EventDetails.jsx";
import Favorites from "./Components/favorites/Favorites.jsx";
import EventWeather from "./Components/EventWeather/EventWeather.jsx";
import EditEvent from "./Components/Event/EditEvent.jsx";

function App() {
  return (
    <UserContextProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/create" element={<AddEvent />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/favorites" element={<ProtectedRouting><Favorites /></ProtectedRouting>}/>
            <Route path="/events/:eventId/weather" element={<ProtectedRouting><EventWeather /></ProtectedRouting>} />
            <Route path="/events/:eventId/edit" element={<ProtectedRouting><EditEvent /></ProtectedRouting> }/>


            <Route
              path="/home"
              element={
                <ProtectedRouting>
                  <Home />
                </ProtectedRouting>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </UserContextProvider>
  );
}

export default App;
