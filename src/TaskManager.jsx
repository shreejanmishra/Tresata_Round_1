"use client";

import { useState, useEffect } from "react";
import TaskAdder from "./TaskAdder";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilters";
import { CheckCircle2, Circle } from "lucide-react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskTitle) => {
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id, title) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title } : task)));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getFilteredTasks = () => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "incomplete") return tasks.filter((t) => !t.completed);
    return tasks;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const incompleteCount = tasks.filter((t) => !t.completed).length;

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Task Manager
          </h1>
          <p className="text-muted-foreground">Stay organized and productive</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">
              Total Tasks
            </div>
            <div className="text-2xl font-bold text-primary">
              {tasks.length}
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Completed</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {completedCount}
              </span>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Remaining</div>
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                {incompleteCount}
              </span>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="mb-6">
          <TaskAdder onAddTask={addTask} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Task List */}
        <div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                {tasks.length === 0
                  ? "No tasks yet. Add one to get started!"
                  : filter === "completed"
                  ? "No completed tasks yet."
                  : "No incomplete tasks. Great job!"}
              </p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}
