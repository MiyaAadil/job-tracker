import { useState } from 'react'
import { supabase } from './lib/supabase'

const Auth = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")
        setLoading(true);

        const { error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl">
            <h1 className="text-2xl font-bold mb-4 text-center">
                {isSignUp ? "Create account" : "Log in"}
            </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-700 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-500 mt-3 underline block mx-auto"
      >
        {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
      </button>
    </div>
    )
}

export default Auth;