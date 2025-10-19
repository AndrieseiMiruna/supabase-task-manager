import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase-client';

const TaskList = () => {
    // Sample tasks for demonstration
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
            
            if (error) {
                console.error(error);
            } else {
                setTasks(data);
            }
        };
        fetchTasks();
    }, []);

    const toggleTask = async(id, completed) => {
        const { data, error } = await supabase.from('tasks').update({ completed: !completed }).eq('id', id).select().single();
        if (error) {
            console.error(error);
        } else {
            setTasks(tasks.map(task => task.id === id ? data : task));
        }
    };

    const deleteTask = async (id) => {
        const { data, error } = await supabase.from('tasks').delete().eq('id', id).select().single();
        if (error) {
            console.error(error);
        } else {
            setTasks(tasks.filter(task => task.id !== id));
        }   
    };

    return (
        <div className="task-list">
            <h2>Your Tasks</h2>
            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks yet. Add one above!</p>
            ) : (
                <div className="tasks-container">
                    {tasks.map(task => (
                        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                            <div className="task-content">
                                <div className="task-header">
                                    <h3 className="task-title">{task.title}</h3>
                                    <div className="task-actions">
                                        <button 
                                            className="toggle-btn"
                                            onClick={() => toggleTask(task.id, task.completed)}
                                        >
                                            {task.completed ? '✓' : '○'}
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <small className="task-date">
                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;