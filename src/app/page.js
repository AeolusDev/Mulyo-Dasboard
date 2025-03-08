'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "./globals.css";

export default function Login() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  const handleMouseMove = (e, elementId) => {
    if (activeInput === elementId) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/home");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden" data-theme="dark">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Grid with radial fade */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.4) 1px, transparent 5px)
              `,
              backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
              mask: 'radial-gradient(circle at center, transparent 0%, black 70%)',
              WebkitMask: 'radial-gradient(circle, rgba(106,45,194,0.3939776594231442) 100%, rgba(0,0,0,0.7637255585828081) 90%)',
              opacity: '0.4'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className="card bg-base-100 
            shadow-[0_0_30px_rgba(147,51,234,0.2)] 
            hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
            transition-all duration-500 ease-out transform hover:-translate-y-2
            border-2 border-[rgba(147,51,234,0.3)] backdrop-blur-sm
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-[rgba(147,51,234,0.2)] before:via-transparent 
            before:to-[rgba(147,51,234,0.2)] before:rounded-lg 
            before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500"
          >
            <div className="card-body p-8">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(147,51,234,0.1)] to-transparent rounded-lg pointer-events-none" />
              
              {/* Card Content */}
              <div className="space-y-6 relative z-10">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary-content">
                    Mulyo Dashboard
                  </h2>
                  <p className="mt-2 text-sm text-primary-content/70">
                    Login To Access The Dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary-content">Email Address</span>
                    </label>
                    <div 
                      className="relative overflow-hidden rounded-lg"
                      onMouseMove={(e) => handleMouseMove(e, 'email')}
                      onMouseEnter={() => setActiveInput('email')}
                      onMouseLeave={() => setActiveInput(null)}
                    >
                      <input
                        type="email"
                        placeholder="fav@alternativescans.icu"
                        className="input w-full bg-base-300 
                          border-2 border-[rgba(147,51,234,0.3)]
                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                          transition-all duration-300
                          focus:outline-none focus:border-[rgba(147,51,234,0.8)]
                          hover:border-[rgba(147,51,234,0.5)]
                          text-primary-content"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {activeInput === 'email' && (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(
                              200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                              rgba(147, 51, 234, 0.15),
                              transparent 70%
                            )`
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary-content">Password</span>
                    </label>
                    <div 
                      className="relative overflow-hidden rounded-lg"
                      onMouseMove={(e) => handleMouseMove(e, 'password')}
                      onMouseEnter={() => setActiveInput('password')}
                      onMouseLeave={() => setActiveInput(null)}
                    >
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input w-full bg-base-300 
                          border-2 border-[rgba(147,51,234,0.3)]
                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]
                          transition-all duration-300
                          focus:outline-none focus:border-[rgba(147,51,234,0.8)]
                          hover:border-[rgba(147,51,234,0.5)]
                          text-primary-content"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      {activeInput === 'password' && (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(
                              200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                              rgba(147, 51, 234, 0.15),
                              transparent 70%
                            )`
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-error bg-error/10 border-2 border-error/50 text-error-content">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div 
                    className="relative overflow-hidden rounded-lg"
                    onMouseMove={(e) => handleMouseMove(e, 'submit')}
                    onMouseEnter={() => setActiveInput('submit')}
                    onMouseLeave={() => setActiveInput(null)}
                  >
                    <button 
                      type="submit" 
                      className="btn w-full bg-base-300 text-primary-content
                        border-2 border-[rgba(147,51,234,0.3)]
                        shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                        hover:border-[rgba(147,51,234,0.5)]
                        hover:shadow-[0_4px_8px_rgba(147,51,234,0.2)]
                        transition-all duration-300
                        active:transform active:translate-y-0.5"
                    >
                      Sign In
                      <span className="ml-2">→</span>
                    </button>
                    {activeInput === 'submit' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(
                            200px circle at ${mousePosition.x}px ${mousePosition.y}px,
                            rgba(147, 51, 234, 0.15),
                            transparent 70%
                          )`
                        }}
                      />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
