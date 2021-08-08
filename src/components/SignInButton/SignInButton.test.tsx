import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { useSession, signIn, signOut } from "next-auth/client";

import { SignInButton } from ".";

jest.mock("next-auth/client");


describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    const signInWithGithub = screen.getByText("Sign in with Github");

    fireEvent.click(signInWithGithub);

    expect(signInWithGithub).toBeInTheDocument();
    expect(signInMocked).toHaveBeenCalled();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);
    const signOutMocked = mocked(signOut);

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@email.com" },
        expires: "fake-expires",
      },
      false,
    ]);

    render(<SignInButton />);

    const signOutUser = screen.getByText("John Doe");

    fireEvent.click(signOutUser);

    expect(signOutUser).toBeInTheDocument();
    expect(signOutMocked).toHaveBeenCalled();
  });
});
