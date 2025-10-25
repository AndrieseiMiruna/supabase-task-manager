import React, { useState } from 'react';
import { supabase } from '../supabase-client';

const TaskList = ({ tasks, setTasks }) => {
   
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '' });

   
    const toggleTask = async (id, completed) => {
        const { data, error } = await supabase.from('tasks').update({ completed: !completed }).eq('id', id).select().single();
        if (error) {
            console.error(error);
        } else {
            setTasks(tasks.map(task => task.id === id ? data : task));
        }
    };

    const deleteTask = async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) {
            console.error(error);
        } else {
            setTasks(tasks.filter(task => task.id !== id));
        }   
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setEditForm({ title: task.title, description: task.description });
    };

    const closeEditModal = () => {
        setEditingTask(null);
        setEditForm({ title: '', description: '' });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('tasks')
            .update({ 
                title: editForm.title, 
                description: editForm.description 
            })
            .eq('id', editingTask.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
        } else {
            setTasks(tasks.map(task => task.id === editingTask.id ? data : task));
            closeEditModal();
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
                                            className="edit-btn"
                                            onClick={() => openEditModal(task)}
                                            title="Edit task"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="toggle-btn"
                                            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                            onClick={() => toggleTask(task.id, task.completed)}
                                        >
                                            {task.completed ? '✓' : '✓'}
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => deleteTask(task.id)}
                                            title="Delete task"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <small className="task-date">
                                    Created: {new Date(task.created_at).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingTask && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Task</h3>
                            <button className="close-btn" onClick={closeEditModal}>×</button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label htmlFor="edit-title">Task Title</label>
                                <input
                                    type="text"
                                    id="edit-title"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-description">Description</label>
                                <textarea
                                    id="edit-description"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeEditModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;