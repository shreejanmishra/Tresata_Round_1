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
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Task 2",
        status: "completed",
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

  it("renders task wrappers with correct roles", () => {
    const tasks = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
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

    const wrapper = screen.getByTestId("task-wrapper");
    expect(wrapper).toHaveAttribute("role", "article");
  });

  it("renders tasks with animation classes", () => {
    const tasks = [
      {
        id: 1,
        title: "Task 1",
        status: "in-progress",
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

    const wrapper = screen.getByTestId("task-wrapper");
    expect(wrapper).toHaveClass(
      "animate-in",
      "fade-in",
      "slide-in-from-bottom-2"
    );
  });

  it("passes correct props to TaskItem components", () => {
    const onToggle = jest.fn();
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    const tasks = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <TaskList
        tasks={tasks}
        onToggleTask={onToggle}
        onUpdateTask={onUpdate}
        onDeleteTask={onDelete}
      />
    );

    expect(screen.getByTestId("task-1")).toBeInTheDocument();
  });
});
