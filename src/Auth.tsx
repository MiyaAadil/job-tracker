import { useState } from 'react'
import { supabase } from './lib/supabase'
import toast from "react-hot-toast";

const Auth = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")
        setLoading(true);

        const { error } = isSignUp
            ? await supabase.auth.signUp({ 
              email, 
              password,
              options: { data: { full_name: fullName } },
            })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setError(error.message);
        } else {
          toast.success(isSignUp ? "Account created!" : "Welcome back!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl w-full flex rounded-2xl overflow-hidden shadow-2xl">
                {/* Brand Panel */}
                <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 text-white p-12 hidden md:flex flex-col justify-between">
                    <div>
                        <h1 className="text-5xl font-bold mb-2 text-center">Job Application Tracker</h1>
                        <p className="text-blue-200 text-center">SignIn/ LogIn to start tracking your job applications here →</p>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-1/2 bg-white p-12">
                    <div className="max-w-sm mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {isSignUp ? "Create Account" : "Welcome Back"}
                            </h1>
                            <p className="text-gray-500 mt-2">
                                {isSignUp ? "Join us today" : "Sign in to continue"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 pl-11 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : isSignUp ? "Create Account" : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                            >
                                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;