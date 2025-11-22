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
        <div key={task.id} className="animate-in">
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
