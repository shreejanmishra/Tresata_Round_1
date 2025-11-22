import { useState } from "react";

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
      className="flex flex-col gap-2 sm:gap-3"
      aria-label="Add new task form"
    >
      <input
        type="text"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        aria-label="Enter task title"
        placeholder="Add a new task..."
        className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
      />
      {showDescription && (
        <textarea
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          placeholder="Add task description (optional)..."
          aria-label="Enter task description"
          className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20 sm:h-24 text-sm"
        />
      )}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <button
          type="submit"
          aria-label="Add new task"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:opacity-80 transition-opacity font-medium flex items-center gap-2 flex-1 sm:flex-initial justify-center"
        >
          <span className="text-center">Add</span>
        </button>
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          aria-label={
            showDescription
              ? "Hide description field"
              : "Show description field"
          }
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer flex-1 sm:flex-initial ${
            showDescription
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground"
          }`}
        >
          {showDescription ? "Hide" : "Details"}
        </button>
      </div>
    </form>
  );
};

export default TaskAdder;
