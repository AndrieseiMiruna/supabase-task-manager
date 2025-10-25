
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { supabase } from '../supabase-client';
import { useState, useEffect } from 'react';

function TaskManagement({session}) {

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
        <div className="task-management">
            <TaskForm tasks={tasks} setTasks={setTasks} session={session} />
            <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
    );
}

export default TaskManagement;
