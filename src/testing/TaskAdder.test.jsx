import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskAdder from "../TaskAdder.jsx";

describe("TaskAdder", () => {
  it("renders input and button", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    expect(
      screen.getByPlaceholderText("Add a new task...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("renders form with correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const form = screen.getByRole("form", { hidden: false });
    expect(form).toHaveAttribute("aria-label", "Add new task form");
  });

  it("input has correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    expect(input).toHaveAttribute("aria-label", "Enter task title");
  });

  it("adds a task on submit with title only", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Test task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("Test task", "");
    expect(input).toHaveValue("");
  });

  it("adds a task with title and description", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleDescBtn = screen.getByRole("button", {
      name: /Show description/i,
    });
    await user.click(toggleDescBtn);

    const titleInput = screen.getByPlaceholderText("Add a new task...");
    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );

    await user.type(titleInput, "Test task");
    await user.type(descInput, "Test description");

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("Test task", "Test description");
    expect(titleInput).toHaveValue("");
    // Description field should be hidden after submission
    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();
  });

  it("shows and hides description field on toggle", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Show description/i,
    });

    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();

    await user.click(toggleBtn);

    expect(
      screen.getByPlaceholderText("Add task description (optional)...")
    ).toBeInTheDocument();

    await user.click(toggleBtn);

    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();
  });

  it("trims whitespace from task title and description", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleDescBtn = screen.getByRole("button", {
      name: /Show description/i,
    });
    await user.click(toggleDescBtn);

    const titleInput = screen.getByPlaceholderText("Add a new task...");
    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );

    await user.type(titleInput, "  test  ");
    await user.type(descInput, "  description  ");

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("test", "description");
  });

  it("does not add empty task", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("does not add task with only whitespace", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("clears inputs after successful task submission", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleDescBtn = screen.getByRole("button", {
      name: /Show description/i,
    });
    await user.click(toggleDescBtn);

    const titleInput = screen.getByPlaceholderText("Add a new task...");
    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );

    await user.type(titleInput, "New Task");
    await user.type(descInput, "New Description");

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(titleInput).toHaveValue("");
    // Description field should be hidden after submission, confirming form reset
    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();
  });

  it("hides description field after submission", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Show description/i,
    });
    await user.click(toggleBtn);

    const titleInput = screen.getByPlaceholderText("Add a new task...");
    await user.type(titleInput, "Test task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();
  });

  it("button has correct aria-label", () => {
    const mockAdd = jest.fn();
    render(<TaskAdder onAddTask={mockAdd} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toHaveAttribute("aria-label", "Add new task");
  });

  it("description input has correct aria-label", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Show description/i,
    });
    await user.click(toggleBtn);

    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );
    expect(descInput).toHaveAttribute("aria-label", "Enter task description");
  });
});
