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
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8 border border-border rounded-lg bg-background shadow-lg">
        <div className="mb-3 sm:mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[oklch(0.4365_0.1509_256.72)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks by title"
              className="w-full pl-10 pr-10 py-2 sm:py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm sm:text-base"
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

        <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 overflow-x-auto">
            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              allCount={tasks.length}
              pendingCount={pendingCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <label
              htmlFor="sort-by"
              className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
            >
              Sort:
            </label>
            <select
              id="sort-by"
              aria-label="Sort tasks by name or creation time"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-xs sm:text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
          </div>
        </div>
        <div className="mt-4 mb-6 sm:mt-6">
          <TaskForm onAddTask={addTask} />
        </div>
        <div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 sm:py-8 bg-card rounded-lg border border-border">
              <Circle className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-xs sm:text-sm px-2">
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
              <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                  <label
                    htmlFor="items-per-page"
                    className="text-muted-foreground whitespace-nowrap"
                  >
                    Tasks/Page:
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
                    className="px-2 py-1 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-xs sm:text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div className="flex items-center justify-between px-1 gap-1 sm:gap-2 sm:px-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || itemsPerPage === "all"}
                    aria-label="Go to previous page"
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {itemsPerPage === "all"
                      ? `${filteredTasks.length}`
                      : `${currentPage}/${totalPages}`}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={
                      currentPage === totalPages || itemsPerPage === "all"
                    }
                    aria-label="Go to next page"
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
