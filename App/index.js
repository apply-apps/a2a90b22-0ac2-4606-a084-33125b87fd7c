// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://example.com/api';  // Replace with your actual API base URL 

const TaskList = ({ tasks, setTasks }) => {
    const toggleComplete = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <View>
            {tasks.map((task, index) => (
                <View key={index} style={styles.taskContainer}>
                    <Text style={task.completed ? styles.completedTask : styles.task}>
                        {task.description}
                    </Text>
                    <View style={styles.buttons}>
                        <Button title={task.completed ? 'Undo' : 'Complete'} onPress={() => toggleComplete(index)} />
                        <Button title="Delete" onPress={() => deleteTask(index)} />
                    </View>
                </View>
            ))}
        </View>
    );
};

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/tasks`);
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
                const response = await axios.post(`${BASE_URL}/tasks`, task);
                setTasks([...tasks, response.data]);
                setNewTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
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
                <TaskList tasks={tasks} setTasks={setTasks} />
            </ScrollView>
        </SafeAreaView>
    );
}

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
});