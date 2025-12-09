import { useState, useEffect } from "react";

const AUTH_KEY = "employee_authenticated";

export function useEmployeeAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check sessionStorage on mount
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_KEY, "true");
        setPasswordInput("");
      } else {
        setPasswordError(data.error || "Incorrect password. Please try again.");
        setPasswordInput("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setPasswordError("Unable to authenticate. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  return {
    isAuthenticated,
    passwordInput,
    setPasswordInput,
    passwordError,
    isLoggingIn,
    handleLogin,
    logout,
  };
}
