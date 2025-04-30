import React from "react"
import { Navigate } from "react-router-dom"
import { auth } from "../firebase" // <-- aqui está o fix

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser

  return user ? children : <Navigate to="/admin/login" />
}

export default PrivateRoute
