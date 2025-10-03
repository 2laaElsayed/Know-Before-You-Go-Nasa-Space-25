import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function ProtectedRouting({ children }) {
  const { user } = useContext(UserContext);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
