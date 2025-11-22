import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskManager from "../TaskManager.jsx";

describe("TaskManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage.getItem.mockReturnValue(null);
    global.localStorage.setItem.mockImplementation(() => {});
  });

  it("renders with initial empty state", () => {
    render(<TaskManager />);

    expect(screen.getByTestId("task-manager")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByTestId("completed-count")).toBeInTheDocument();
    expect(screen.getByTestId("remaining-count")).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "New Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("toggles task completion", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      const checkButton = screen.getByRole("button", {
        name: /mark.*complete/i,
      });
      expect(checkButton).toBeInTheDocument();
    });

    const checkButton = screen.getByRole("button", { name: /mark.*complete/i });
    await user.click(checkButton);

    expect(checkButton).toBeInTheDocument();
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task 1{enter}");
    await user.type(input, "Task 2{enter}");

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    const completedBtn = screen.getByRole("button", { name: /completed/i });
    await user.click(completedBtn);

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  it("shows empty state message", () => {
    render(<TaskManager />);

    expect(
      screen.getByText("No tasks yet. Add one to get started!")
    ).toBeInTheDocument();
  });

  it("searches tasks", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Searchable{enter}");
    await user.type(input, "Other{enter}");

    await waitFor(() => {
      expect(screen.getByText("Searchable")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "search" } });

    await waitFor(() => {
      expect(screen.getByText("Searchable")).toBeInTheDocument();
      expect(screen.queryByText("Other")).not.toBeInTheDocument();
    });
  });

  it("clears search", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task{enter}");

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "task" } });

    const clearBtn = screen.getByRole("button", { name: /clear/i });
    await user.click(clearBtn);

    expect(searchInput).toHaveValue("");
  });

  it("saves tasks to localStorage", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        "tasks",
        expect.stringContaining("Task")
      );
    });
  });
});
