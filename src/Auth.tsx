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
        <div id='bg-img' className="max-w-sm mx-auto mt-20 p-6 rounded-xl relative bg-[#cedae7] backdrop-blur-2xl">
            <h1 className="text-2xl font-bold mb-4 text-center">
                {isSignUp ? "Sign Up" : "Log in"}
            </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {isSignUp && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="border-b p-2"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder='Email'
          className="border-b p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="border-b p-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6d8cbe] text-white p-2 rounded-3xl disabled:opacity-50 cursor-pointer transition-all duration-300 hover:bg-[#6582b1]"
        >
          {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-500 mt-3 underline block mx-auto cursor-pointer"
      >
        {isSignUp ? "Already have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
    )
}

export default Auth;