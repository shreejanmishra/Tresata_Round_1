import { render, screen } from "@testing-library/react";
import TaskList from "../TaskList.jsx";

jest.mock("../TaskItem.jsx", () => {
  return function MockTaskItem({ task }) {
    return <div data-testid={`task-${task.id}`}>{task.title}</div>;
  };
});

describe("TaskList", () => {
  it("renders a TaskItem for each task", () => {
    const tasks = [
      {
        id: 1,
        title: "Task 1",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Task 2",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <TaskList
        tasks={tasks}
        onToggleTask={jest.fn()}
        onUpdateTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    expect(screen.getByTestId("task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-2")).toBeInTheDocument();
  });

  it("renders nothing when tasks array is empty", () => {
    render(
      <TaskList
        tasks={[]}
        onToggleTask={jest.fn()}
        onUpdateTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    expect(screen.queryByTestId(/task-/)).not.toBeInTheDocument();
  });
});
