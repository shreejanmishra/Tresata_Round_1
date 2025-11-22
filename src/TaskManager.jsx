"use client";

import { useState, useEffect } from "react";
import TaskForm from "./TaskAdder";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilters";
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const addTask = (taskTitle, taskDescription) => {
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id, title, description) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title, description: description || "" }
          : task
      )
    );
  };

  const toggleTask = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === "completed")
      filtered = filtered.filter((t) => t.status === "completed");
    if (filter === "pending")
      filtered = filtered.filter((t) => t.status === "pending");
    if (filter === "in-progress")
      filtered = filtered.filter((t) => t.status === "in-progress");

    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (sortBy === "name-asc") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "name-desc") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex =
    (currentPage - 1) *
    (itemsPerPage === "all" ? filteredTasks.length : itemsPerPage);
  const paginatedTasks =
    itemsPerPage === "all"
      ? filteredTasks
      : filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchQuery, sortBy]);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <div
      data-testid="task-manager"
      className="min-h-screen bg-gradient-to-br from-background to-secondary"
    >
      <div className="container max-w-2xl mx-auto px-4 py-8 border border-border rounded-lg bg-background shadow-lg">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">
              Total Tasks
            </div>
            <div
              className="text-2xl font-bold text-primary"
              data-testid="total-count"
            >
              {tasks.length}
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Completed</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span
                className="text-2xl font-bold text-green-500"
                data-testid="completed-count"
              >
                {completedCount}
              </span>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">
              In Progress
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-blue-500" />
              <span
                className="text-2xl font-bold text-blue-500"
                data-testid="in-progress-count"
              >
                {inProgressCount}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks by title"
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm text-muted-foreground">
              Sort by:
            </label>
            <select
              id="sort-by"
              aria-label="Sort tasks by name or creation time"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        <div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                {tasks.length === 0
                  ? "No tasks yet. Add one to get started!"
                  : debouncedSearchQuery
                  ? `No tasks match "${debouncedSearchQuery}"`
                  : filter === "in-progress"
                  ? "No in-progress tasks."
                  : "No pending tasks. Great job!"}
              </p>
            </div>
          ) : (
            <>
              <TaskList
                tasks={paginatedTasks}
                onToggleTask={toggleTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-center gap-3">
                  <label
                    htmlFor="items-per-page"
                    className="text-sm text-muted-foreground"
                  >
                    Items per page:
                  </label>
                  <select
                    id="items-per-page"
                    aria-label="Select number of items to display per page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(
                        e.target.value === "all"
                          ? "all"
                          : Number.parseInt(e.target.value)
                      );
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div className="flex items-center justify-between px-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || itemsPerPage === "all"}
                    aria-label="Go to previous page"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {itemsPerPage === "all"
                      ? `All ${filteredTasks.length} tasks`
                      : `Page ${currentPage} of ${totalPages}`}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={
                      currentPage === totalPages || itemsPerPage === "all"
                    }
                    aria-label="Go to next page"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <TaskForm onAddTask={addTask} />
        </div>
      </div>
    </div>
  );
}
