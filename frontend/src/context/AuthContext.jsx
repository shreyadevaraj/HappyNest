import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('happyNestUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simulate backend check using localStorage 'users' array
        const users = JSON.parse(localStorage.getItem('happyNestUsers') || '[]');
        const existingUser = users.find(u => u.email === email && u.password === password);

        if (existingUser) {
            setUser(existingUser);
            localStorage.setItem('happyNestUser', JSON.stringify(existingUser));
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const signup = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('happyNestUsers') || '[]');

        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { id: Date.now(), name, email, password, projects: [] };
        users.push(newUser);
        localStorage.setItem('happyNestUsers', JSON.stringify(users));

        // Auto login
        setUser(newUser);
        localStorage.setItem('happyNestUser', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('happyNestUser');
    };

    const saveProject = (projectData) => {
        if (!user) return;

        const updatedUser = { ...user, projects: [...(user.projects || []), { ...projectData, id: Date.now(), date: new Date().toISOString() }] };
        setUser(updatedUser);
        localStorage.setItem('happyNestUser', JSON.stringify(updatedUser)); // Update session

        // Update persistent DB
        const users = JSON.parse(localStorage.getItem('happyNestUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('happyNestUsers', JSON.stringify(users));
        }
    };

    const deleteProject = (projectId) => {
        if (!user) return;

        const updatedProjects = user.projects.filter(p => p.id !== projectId);
        const updatedUser = { ...user, projects: updatedProjects };

        setUser(updatedUser);
        localStorage.setItem('happyNestUser', JSON.stringify(updatedUser));

        // Update persistent DB
        const users = JSON.parse(localStorage.getItem('happyNestUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('happyNestUsers', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, saveProject, deleteProject, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
