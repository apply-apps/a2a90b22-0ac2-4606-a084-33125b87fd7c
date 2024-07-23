// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://example.com/api'; // Replace with your actual API base URL

const TaskList = ({ tasks, editTask, deleteTask, toggleComplete }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState('');

    const startEditing = (id, text) => {
        setEditingTaskId(id);
        setEditingTaskText(text);
    };

    const saveEdit = (id) => {
        editTask(id, editingTaskText);
        setEditingTaskId(null);
        setEditingTaskText('');
    };

    return (
        <View>
            {tasks.map((task) => (
                <View key={task.id} style={styles.taskContainer}>
                    {editingTaskId === task.id ? (
                        <TextInput
                            style={styles.input}
                            value={editingTaskText}
                            onChangeText={setEditingTaskText}
                        />
                    ) : (
                        <Text style={task.completed ? styles.completedTask : styles.task}>
                            {task.description}
                        </Text>
                    )}
                    <View style={styles.buttons}>
                        {editingTaskId === task.id ? (
                            <Button title="Save" onPress={() => saveEdit(task.id)} />
                        ) : (
                            <>
                                <Button title={task.completed ? 'Undo' : 'Complete'} onPress={() => toggleComplete(task.id)} />
                                <Button title="Edit" onPress={() => startEditing(task.id, task.description)} />
                                <Button title="Delete" onPress={() => deleteTask(task.id)} />
                            </>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/tasks`);
                setTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask !== '') {
            const task = { description: newTask, completed: false };
            try {
                const response = await axios.post(`${API_BASE_URL}/tasks`, task);
                setTasks([...tasks, response.data]);
                setNewTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const editTask = async (id, description) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { description });
            const updatedTasks = tasks.map(task =>
                task.id === id ? response.data : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleComplete = async (id) => {
        const task = tasks.find(task => task.id === id);
        try {
            const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { completed: !task.completed });
            const updatedTasks = tasks.map(t =>
                t.id === id ? response.data : t
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Task Manager</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a new task"
                value={newTask}
                onChangeText={setNewTask}
            />
            <Button title="Add Task" onPress={addTask} />
            <ScrollView style={styles.scrollView}>
                <TaskList tasks={tasks} editTask={editTask} deleteTask={deleteTask} toggleComplete={toggleComplete} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30, // To avoid overlapping with the status bar
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    scrollView: {
        marginTop: 20,
    },
    taskContainer: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        marginBottom: 10,
    },
    task: {
        fontSize: 18,
    },
    completedTask: {
        fontSize: 18,
        textDecorationLine: 'line-through',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    inputTask: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        width: '100%',
    },
});

export default App;