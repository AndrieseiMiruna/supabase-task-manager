
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { supabase } from '../supabase-client';
import { useState, useEffect } from 'react';

function TaskManagement({session}) {

    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')

        if (error) {
            console.error(error);
        } else {
            setTasks(data || []);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = supabase.channel("tasks-channel");

        channel.on("postgres_changes", {
            event: "INSERT", 
            schema: "public", 
            table: "tasks"
        }, (payload) => {
            const newTask = payload.new;
            console.log(payload);
            setTasks((prev) => [...prev, newTask]);
        })
        .subscribe((status) => {
            console.log('Subscription: ', status);
            if (status === 'CHANNEL_ERROR') {
                console.error('Channel error occurred');
            }
        });

        // Cleanup function
        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id]);
    
    return (
        <div className="task-management">
            <TaskForm tasks={tasks} setTasks={setTasks} session={session} />
            <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
    );
}

export default TaskManagement;
