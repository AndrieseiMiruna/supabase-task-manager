import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { supabase } from './supabase-client';
import { useState, useEffect } from 'react';

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        
        if (error) {
            console.error(error);
        } else {
            setTasks(data || []);
        }
    };
    fetchTasks();
}, []);

  return (
    <div className="App">
      <TaskForm tasks={tasks} setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;
