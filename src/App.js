import './App.css';
import TaskManagement from './components/TaskManagement';
import { Auth } from './components/Auth';
import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import Header from './components/Header';

function App() {
  const [session, setSession] = useState(null);
  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  useEffect(() => {

    fetchSession();

    const {data:authListener} = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <Auth setSession={setSession}/>;
  }

  return (
    <div className="app">
      <Header setSession={setSession}/>
      <div className="app__container">
        <TaskManagement session={session}/>
      </div>
    </div>
  );
}

export default App;
