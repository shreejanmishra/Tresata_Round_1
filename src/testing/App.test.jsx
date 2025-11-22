import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

jest.mock("../TaskManager.jsx", () => {
  return function MockTaskManager() {
    return <div data-testid="task-manager">Task Manager</div>;
  };
});

describe("App", () => {
  it("renders the App component", () => {
    render(<App />);
    expect(screen.getByTestId("task-manager")).toBeInTheDocument();
  });
});
