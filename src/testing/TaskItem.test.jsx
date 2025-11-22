import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../TaskItem.jsx";

describe("TaskItem", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "pending",
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

  it("renders status button", () => {
    render(<TaskItem {...mockProps} />);
    expect(
      screen.getByRole("button", { name: /Change task status/i })
    ).toBeInTheDocument();
  });

  it("cycles through statuses on status button click", async () => {
    const user = userEvent.setup();
    const onToggleMock = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggle={onToggleMock}
        onUpdate={mockProps.onUpdate}
        onDelete={mockProps.onDelete}
      />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    await user.click(statusButton);

    // Should cycle from pending to in-progress
    expect(onToggleMock).toHaveBeenCalledWith(1, "in-progress");
  });

  it("shows strikethrough for completed task", () => {
    const completedTask = { ...mockTask, status: "completed" };
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

  it("shows edit and delete buttons on desktop hover", () => {
    render(<TaskItem {...mockProps} />);

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");

    fireEvent.mouseEnter(group);

    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const onDeleteMock = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockProps.onToggle}
        onUpdate={mockProps.onUpdate}
        onDelete={onDeleteMock}
      />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");
    fireEvent.mouseEnter(group);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    await user.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });

  it("enters edit mode when edit button clicked", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");
    fireEvent.mouseEnter(group);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
  });

  it("saves updated task title", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockProps.onToggle}
        onUpdate={onUpdateMock}
        onDelete={mockProps.onDelete}
      />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");
    fireEvent.mouseEnter(group);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    const input = screen.getByDisplayValue("Test Task");
    await user.clear(input);
    await user.type(input, "Updated Task");

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).toHaveBeenCalledWith(
      1,
      "Updated Task",
      "Test Description"
    );
  });

  it("cancels edit mode with Escape key", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");
    fireEvent.mouseEnter(group);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    const input = screen.getByDisplayValue("Test Task");
    await user.keyboard("{Escape}");

    expect(screen.queryByDisplayValue("Test Task")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("does not update if title is unchanged", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockProps.onToggle}
        onUpdate={onUpdateMock}
        onDelete={mockProps.onDelete}
      />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const group = statusButton.closest(".group");
    fireEvent.mouseEnter(group);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it("shows correct status color for pending task", () => {
    render(<TaskItem {...mockProps} />);
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer).toHaveClass("bg-yellow-50");
  });

  it("shows correct status color for in-progress task", () => {
    const inProgressTask = { ...mockTask, status: "in-progress" };
    render(
      <TaskItem
        task={inProgressTask}
        onToggle={mockProps.onToggle}
        onUpdate={mockProps.onUpdate}
        onDelete={mockProps.onDelete}
      />
    );
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer).toHaveClass("bg-blue-50");
  });

  it("shows correct status color for completed task", () => {
    const completedTask = { ...mockTask, status: "completed" };
    render(
      <TaskItem
        task={completedTask}
        onToggle={mockProps.onToggle}
        onUpdate={mockProps.onUpdate}
        onDelete={mockProps.onDelete}
      />
    );
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer).toHaveClass("bg-green-50");
  });
});
