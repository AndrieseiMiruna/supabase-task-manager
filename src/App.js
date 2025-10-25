import './App.css';
import TaskManagement from './components/TaskManagement';
import { Auth } from './components/Auth';
import { useState, useEffect } from 'react';
import { supabase } from './supabase-client';
import Header from './components/Header';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  if (!session) {
    return <Auth setSession={setSession}/>;
  }

  return (
    <div className="app">
      <Header setSession={setSession}/>
      <div className="app__container">
        <TaskManagement />
      </div>
    </div>
  );
}

export default App;
