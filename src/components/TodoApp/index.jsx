import React, { useState } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project presentation', completed: false },
    { id: 2, text: 'Buy groceries', completed: true },
    { id: 3, text: 'Call the bank', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <div className="sidebar">
        <h2>Todo App</h2>
        <div className="filters">
          <button 
            className={activeFilter === 'all' ? 'active' : ''} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={activeFilter === 'active' ? 'active' : ''} 
            onClick={() => setActiveFilter('active')}
          >
            Active
          </button>
          <button 
            className={activeFilter === 'completed' ? 'active' : ''} 
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="main-content">
        <h3>Today's Tasks</h3>
        <form onSubmit={handleAddTodo} className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit">+</button>
        </form>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkmark"></span>
                <span className="todo-text">{todo.text}</span>
              </label>
              <button 
                className="delete-btn"
                onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
