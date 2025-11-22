import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../TaskItem.jsx";

describe("TaskItem", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const mockProps = {
    task: mockTask,
    onToggle: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task title", () => {
    render(<TaskItem {...mockProps} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("renders checkbox button", () => {
    render(<TaskItem {...mockProps} />);
    expect(
      screen.getByRole("button", { name: /mark.*as complete/i })
    ).toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    await user.click(
      screen.getByRole("button", { name: /mark.*as complete/i })
    );

    expect(mockProps.onToggle).toHaveBeenCalledWith(1);
  });

  it("shows strikethrough for completed task", () => {
    const completedTask = { ...mockTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        onToggle={mockProps.onToggle}
        onUpdate={mockProps.onUpdate}
        onDelete={mockProps.onDelete}
      />
    );

    const titleElement = screen.getByTestId("task-title");
    expect(titleElement).toHaveClass("line-through");
  });

  it("shows edit and delete on hover", () => {
    render(<TaskItem {...mockProps} />);

    const button = screen.getByRole("button", { name: /mark.*as complete/i });
    const group = button.closest(".group");

    fireEvent.mouseEnter(group);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onDelete when delete clicked", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const button = screen.getByRole("button", { name: /mark.*as complete/i });
    const group = button.closest(".group");
    fireEvent.mouseEnter(group);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(mockProps.onDelete).toHaveBeenCalledWith(1);
  });
});
