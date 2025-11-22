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

    const titleInput = screen.getByPlaceholderText("Add a new task...");

    // Type title - this auto-shows the description field
    await user.type(titleInput, "Test task");

    // Description should now be visible
    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );
    expect(descInput).toBeInTheDocument();

    await user.type(descInput, "Test description");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockAdd).toHaveBeenCalledWith("Test task", "Test description");
    expect(titleInput).toHaveValue("");
    // Description field should be hidden after submission
    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();
  });

  it("shows description field when title is entered", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    // Description should initially not be shown
    expect(
      screen.queryByPlaceholderText("Add task description (optional)...")
    ).not.toBeInTheDocument();

    // Type in title to trigger description field
    const titleInput = screen.getByPlaceholderText("Add a new task...");
    await user.type(titleInput, "Test");

    // Description field should now be visible
    expect(
      screen.getByPlaceholderText("Add task description (optional)...")
    ).toBeInTheDocument();
  });

  it("trims whitespace from task title and description", async () => {
    const mockAdd = jest.fn();
    const user = userEvent.setup();
    render(<TaskAdder onAddTask={mockAdd} />);

    const titleInput = screen.getByPlaceholderText("Add a new task...");

    // Type title with whitespace - this auto-shows the description field
    await user.type(titleInput, "  test  ");

    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );

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

    const titleInput = screen.getByPlaceholderText("Add a new task...");

    // Type title to auto-show description field
    await user.type(titleInput, "New Task");

    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );

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

    const titleInput = screen.getByPlaceholderText("Add a new task...");

    // Type title to auto-show description field
    await user.type(titleInput, "Test task");

    // Verify description field is now visible
    expect(
      screen.getByPlaceholderText("Add task description (optional)...")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add/i }));

    // After submission, description field should be hidden
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

    const titleInput = screen.getByPlaceholderText("Add a new task...");

    // Type title to auto-show description field
    await user.type(titleInput, "Test");

    const descInput = screen.getByPlaceholderText(
      "Add task description (optional)..."
    );
    expect(descInput).toHaveAttribute("aria-label", "Enter task description");
  });
});
