import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          data-testid="task-wrapper"
          role="article"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <TaskItem
            task={task}
            onToggle={onToggleTask}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        </div>
      ))}
    </div>
  );
}
