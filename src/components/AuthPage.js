import React, { useState } from 'react';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); 

        if (isLogin) {
            if (email && password) onLogin({ email });
            else setError("Please enter email and password.");
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (username && email && password) onLogin({ email, username });
            else setError("Please fill out all fields.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg mx-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">CrowdFix</h1>
                    <p className="mt-2 text-md text-gray-400">{isLogin ? "Sign in to your account" : "Create an account to get started"}</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                            <input id="username" type="text" required value={username} onChange={e => setUsername(e.target.value)}
                                className="mt-2 block w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label>
                        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className={`mt-2 block w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error === "Passwords do not match." ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'}`}/>
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <input id="confirm-password" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                className={`mt-2 block w-full px-4 py-3 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error === "Passwords do not match." ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'}`}/>
                        </div>
                    )}
                     {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-indigo-400 hover:text-indigo-300">
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
