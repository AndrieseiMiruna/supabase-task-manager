import { useState } from 'react';
import { supabase } from '../supabase-client';

export const Auth = ({ setSession }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else{
            setMessage('Signed in successfully');
            setSession(data.session);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setError(error.message);
        } else{
            setMessage('Account created successfully');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp) {
            
            await handleSignUp();
        } else {
            await handleSignIn();
        }
    };
    return (
        <div className="auth__page">
        <div className="auth__container">
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button disabled={loading} type="submit" className="submit-btn">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                <button disabled={loading} type="button" className="link-btn" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}</button>
            </form>
        </div>
        </div>
    );
};