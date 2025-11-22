import { render, screen } from "@testing-library/react";
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
    isSelected: false,
    onToggleSelection: jest.fn(),
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
    render(<TaskItem {...mockProps} onToggle={onToggleMock} />);

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    await user.click(statusButton);

    // Should cycle from pending to in-progress
    expect(onToggleMock).toHaveBeenCalledWith(1, "in-progress");
  });

  it("cycles from in-progress to completed", async () => {
    const user = userEvent.setup();
    const inProgressTask = { ...mockTask, status: "in-progress" };
    const onToggleMock = jest.fn();
    render(
      <TaskItem {...mockProps} task={inProgressTask} onToggle={onToggleMock} />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    await user.click(statusButton);

    expect(onToggleMock).toHaveBeenCalledWith(1, "completed");
  });

  it("cycles from completed back to pending", async () => {
    const user = userEvent.setup();
    const completedTask = { ...mockTask, status: "completed" };
    const onToggleMock = jest.fn();
    render(
      <TaskItem {...mockProps} task={completedTask} onToggle={onToggleMock} />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    await user.click(statusButton);

    expect(onToggleMock).toHaveBeenCalledWith(1, "pending");
  });

  it("shows strikethrough for completed task", () => {
    const completedTask = { ...mockTask, status: "completed" };
    render(<TaskItem {...mockProps} task={completedTask} />);

    const titleElement = screen.getByTestId("task-title");
    expect(titleElement).toHaveClass("line-through");
  });

  it("shows description toggle button when description exists", () => {
    render(<TaskItem {...mockProps} />);
    expect(
      screen.getByRole("button", { name: /Description/i })
    ).toBeInTheDocument();
  });

  it("toggles description visibility on button click", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const descButton = screen.getByRole("button", { name: /Description/i });
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();

    await user.click(descButton);
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    await user.click(descButton);
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("does not show description toggle when description is empty", () => {
    const taskWithoutDesc = { ...mockTask, description: "" };
    render(<TaskItem {...mockProps} task={taskWithoutDesc} />);

    expect(
      screen.queryByRole("button", { name: /Description/i })
    ).not.toBeInTheDocument();
  });

  it("renders checkbox for task selection", () => {
    render(<TaskItem {...mockProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("calls onToggleSelection when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggleSelectionMock = jest.fn();
    render(
      <TaskItem {...mockProps} onToggleSelection={onToggleSelectionMock} />
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(onToggleSelectionMock).toHaveBeenCalledWith(1);
  });

  it("shows checked checkbox when isSelected is true", () => {
    render(<TaskItem {...mockProps} isSelected={true} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("shows unchecked checkbox when isSelected is false", () => {
    render(<TaskItem {...mockProps} isSelected={false} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders edit button", () => {
    render(<TaskItem {...mockProps} />);
    const editButtons = screen.getAllByRole("button");
    const editButton = editButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    expect(editButton).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const onDeleteMock = jest.fn();
    render(<TaskItem {...mockProps} onDelete={onDeleteMock} />);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    await user.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });

  it("enters edit mode when edit button clicked", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
  });

  it("saves updated task title and description", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(<TaskItem {...mockProps} onUpdate={onUpdateMock} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue("Test Task");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task");

    const descTextarea = screen.getByDisplayValue("Test Description");
    await user.clear(descTextarea);
    await user.type(descTextarea, "Updated Description");

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).toHaveBeenCalledWith(
      1,
      "Updated Task",
      "Updated Description"
    );
  });

  it("cancels edit mode with Escape key", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const input = screen.getByDisplayValue("Test Task");
    await user.keyboard("{Escape}");

    expect(screen.queryByDisplayValue("Test Task")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("cancels edit with cancel button", async () => {
    const user = userEvent.setup();
    render(<TaskItem {...mockProps} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByDisplayValue("Test Task")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("does not update if title is unchanged", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(<TaskItem {...mockProps} onUpdate={onUpdateMock} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it("does not update if title is empty", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(<TaskItem {...mockProps} onUpdate={onUpdateMock} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const titleInput = screen.getByDisplayValue("Test Task");
    await user.clear(titleInput);

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).not.toHaveBeenCalled();
  });

  it("displays formatted creation date", () => {
    render(<TaskItem {...mockProps} />);
    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });

  it("shows correct status color for pending task", () => {
    render(<TaskItem {...mockProps} />);
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer?.className).toContain("bg-[#D0D0D0]");
  });

  it("shows correct status color for in-progress task", () => {
    const inProgressTask = { ...mockTask, status: "in-progress" };
    render(<TaskItem {...mockProps} task={inProgressTask} />);
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer?.className).toContain("bg-[#FFB03C]");
  });

  it("shows correct status color for completed task", () => {
    const completedTask = { ...mockTask, status: "completed" };
    render(<TaskItem {...mockProps} task={completedTask} />);
    const taskContainer = screen.getByText("Test Task").closest(".group");
    expect(taskContainer?.className).toContain("bg-[#368A04]");
  });

  it("shows Check icon when task is completed", () => {
    const completedTask = { ...mockTask, status: "completed" };
    const { container } = render(
      <TaskItem {...mockProps} task={completedTask} />
    );

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const checkIcon = statusButton.querySelector("svg");
    expect(checkIcon).toBeInTheDocument();
  });

  it("does not show Check icon when task is not completed", () => {
    render(<TaskItem {...mockProps} />);

    const statusButton = screen.getByRole("button", {
      name: /Change task status/i,
    });
    const checkIcon = statusButton.querySelector("svg");
    expect(checkIcon).not.toBeInTheDocument();
  });

  it("updates description only without updating title", async () => {
    const user = userEvent.setup();
    const onUpdateMock = jest.fn();
    render(<TaskItem {...mockProps} onUpdate={onUpdateMock} />);

    const allButtons = screen.getAllByRole("button");
    const editButton = allButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Edit")
    );
    await user.click(editButton);

    const descTextarea = screen.getByDisplayValue("Test Description");
    await user.clear(descTextarea);
    await user.type(descTextarea, "Updated Description");

    const saveButton = screen.getByRole("button", { name: /Save/i });
    await user.click(saveButton);

    expect(onUpdateMock).toHaveBeenCalledWith(
      1,
      "Test Task",
      "Updated Description"
    );
  });
});
