import React, { useState } from 'react';
import { supabase } from '../supabase-client';

const TaskForm = ({ tasks,setTasks, session }) => {
   const [task, setTask] = useState({
    title: '',
    description: '',
    image: '',
   });

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imagePath = null;
        console.log(session.user.id);
        console.log(typeof session.user.id);

        if (task.image) {
            console.log('Task image:', task.image);
            console.log('Image name:', task.image.name);
            console.log('Image type:', task.image.type);
            console.log('Image size:', task.image.size);
            
            const fileName = `${new Date().getTime()}-${task.image.name}`;

            const { data: imageData, error: imageError } = await supabase.storage.from('tasks-images').upload(fileName, task.image);

            if (imageError) {
                return;
            } else {
                imagePath = imageData.path;
            }
        }

        const { data, error } = await supabase.from('tasks').insert({
            title: task.title,
            description: task.description,
            user: session.user.id,
            image_url: imagePath
        }).select().single();

        if (error) {
            console.error(error);
        } else {
            console.log('Task created:', data);
            //We don't need to update the tasks state here because we subscribe to the tasks channel in the TaskManagement component
            // setTasks(prevTasks => {
            //     const newTasks = [...prevTasks];
            //     newTasks.unshift(data);
            //     return newTasks;
            //   });
            setTask({ title: '', description: '', image: '' });
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

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setTask((prev) => ({ ...prev, image: e.target.files[0] }))}
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