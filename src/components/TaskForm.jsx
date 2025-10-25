import React, { useState } from 'react';
import { supabase } from '../supabase-client';

const TaskForm = ({ tasks,setTasks, session }) => {
   const [task, setTask] = useState({
    title: '',
    description: '',
   });

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(session.user.id);
        console.log(typeof session.user.id);

        const { data, error } = await supabase.from('tasks').insert({...task, user: session.user.id}).select().single();

        if (error) {
            console.error(error);
        } else {
            console.log('Task created:', data);
            // setTasks(prevTasks => {
            //     const newTasks = [...prevTasks];
            //     newTasks.unshift(data);
            //     return newTasks;
            //   });
            setTask({ title: '', description: '' });
        }


    };

    return (
        <div className="task-form">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Task Title</label>
                    <input
                        type="text"
                        id="title"
                        value={task.title}
                        onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title..."
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={task.description}
                        onChange={(e) => setTask((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter task description..."
                        rows={4}
                        required
                    />
                </div>
                
                <button type="submit" className="submit-btn">
                    Add Task
                </button>
            </form>
        </div>
    );
};

export default TaskForm;