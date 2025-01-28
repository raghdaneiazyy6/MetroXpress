// src/pages/auth/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loadingState, setLoading] = useState(false);
  const [errorState, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting login with:", { email: formData.email, password: "***" });

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/home/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store both token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        fullName: data.fullName,
        email: data.email
      }));
      
      console.log("Login successful - navigating to profile");
      toast.success("Welcome back!");
      navigate("/profile");
    } catch (error) {
      console.error("Login error details:", error);
      setError(error instanceof Error ? error.message : "Invalid credentials");
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-gray-50">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900  mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 ">Sign in to your account to continue</p>
        </div>

        {errorState && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-600"
          >
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">{errorState}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none">
                <EnvelopeIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none">
                <LockClosedIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 "
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 transition-colors"
              disabled={loadingState}
            >
              {loadingState ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up now
          </Link>
        </p>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-100 to-transparent" />
    </div>
  );
};
