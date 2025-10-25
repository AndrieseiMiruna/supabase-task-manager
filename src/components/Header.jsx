import { supabase } from '../supabase-client';

export default function Header({ setSession }) {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        
        <header>
            <h1>Task Management</h1>
            <button className="link-btn" onClick={() => handleSignOut()}>Sign Out</button>
        </header>
    );
};