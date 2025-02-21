"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "../api/api_service";
import { UserDetails } from "../api/dto";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault()
    try {
      const result = await apiService.login({ username, password });
      if (result.success && result.result) {
        const userDetails: UserDetails = {
          ID: result.result.ID,
          username: result.result.username,
          email: result.result.email,
          name: result.result.name,
        };

        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        router.push("/tasks");
      } else {
        setError(result.err || "Login failed");
      }
    } catch (error) {
      console.log(error)
      setError("An error occurred during login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
