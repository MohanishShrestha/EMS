import React from "react";
import { screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App, { GlobalVariableContext } from "../../App";
import { render } from "./test-utils";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

// Mock child components to isolate integration testing
jest.mock("../Login", () => {
  return function MockLogin({ onLogin }) {
    return (
      <div data-testid="mock-login">
        <button onClick={() => onLogin("mock-token")}>Mock Login</button>
      </div>
    );
  };
});

jest.mock("./project", () => {
  return function MockProject() {
    return <div data-testid="mock-project">Project Component</div>;
  };
});

describe("App Component Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("mock-project")).toBeInTheDocument();
  });

  test("provides global context to children", () => {
    const TestComponent = () => {
      const context = React.useContext(GlobalVariableContext);
      return (
        <div data-testid="context-value">{context.token || "no-token"}</div>
      );
    };

    render(
      <GlobalVariableContext.Provider
        value={{ token: "test-token", setToken: jest.fn() }}
      >
        <TestComponent />
      </GlobalVariableContext.Provider>
    );

    expect(screen.getByTestId("context-value")).toHaveTextContent("test-token");
  });

  test("initializes token from localStorage", () => {
    localStorage.setItem("token", "stored-token");

    const { container } = render(<App />);

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
  });
});
