import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        email,
        password,
      });

      const firebaseUID = response.data[0]?.uid;
      const trainerId = 825800;
      const role = "Client";

      const createUserResponse = await axios.post(
        "http://localhost:3000/users",
        {
          first_name: first_name,
          last_name: last_name,
          role: role,
          firebaseUID: firebaseUID,
          trainerId: trainerId,
          email: email,
        }
      );

      // Check the API response
      if (response.data && createUserResponse.status) {
        console.log("Logged in successfully:", response.data);
        alert("Sign up successful. Please sign in to continue.");
        navigate("/signin"); // Redirect to dashboard
      }
    } catch (error) {
      // Improved error handling
      if (error.response) {
        console.error(
          "Server error:",
          error.response.data.message || error.response
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-32">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm/6 font-medium text-white"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm/6 font-medium text-white"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white"
                >
                  Verify Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="verify-password"
                  type="password"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Have an account?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
