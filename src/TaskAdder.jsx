import { useState } from "react";

import { Plus } from "lucide-react";

const TaskAdder = ({ onAddTask }) => {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onAddTask(titleInput.trim(), descriptionInput.trim());
      setTitleInput("");
      setDescriptionInput("");
      setShowDescription(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
      aria-label="Add new task form"
    >
      <input
        type="text"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        aria-label="Enter task title"
        placeholder="Add a new task..."
        className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {showDescription && (
        <textarea
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Add task description (optional)..."
          aria-label="Enter task description"
          className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
        />
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          aria-label="Add new task"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          aria-label={
            showDescription
              ? "Hide description field"
              : "Show description field"
          }
          className="px-4 py-3 bg-secondary text-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
        >
          {showDescription ? "Hide" : "Details"}
        </button>
      </div>
    </form>
  );
};

export default TaskAdder;
