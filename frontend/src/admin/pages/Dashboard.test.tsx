import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { TranslationProvider } from "../../context/TranslationContext";

const mockGet = vi.fn();
const mockPatch = vi.fn();

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
    patch: (...args: any[]) => mockPatch(...args),
  },
}));

vi.mock("../utils/api", () => ({
  fetchStats: vi.fn().mockResolvedValue({
    users: 11,
    trees: 80,
    people: 373,
    gallery: 71,
    books: 9,
    libraryItems: 9,
    events: 832,
    activity: 832,
  }),
  fetchRecentActivity: vi.fn().mockResolvedValue([
    {
      type: "tree_created",
      description: "Added new family tree: Xavier Cassar",
      actor: { full_name: "Karim Admin" },
      created_at: "2026-11-10T20:00:00Z",
    },
  ]),
}));

let mockUser: any = {
  id: 1,
  email: "karim@rootstunisia.com",
  role: 3,
  roleName: "super_admin",
};

vi.mock("../components/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    isAdmin: mockUser.role === 1 || mockUser.role === 3,
  }),
}));

describe("Dashboard Real Dynamic Statistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockImplementation((url: string) => {
      if (url === "/my/activity-settings") {
        return Promise.resolve({ data: { enabled: true } });
      }
      if (url === "/my/quotas") {
        return Promise.resolve({
          data: {
            tierName: "Super Admin (Unlimited)",
            limits: {
              trees: { used: 80, max: -1 },
              individuals: { used: 373, max: -1 },
              gallery: { used: 71, max: -1 },
            },
          },
        });
      }
      if (url === "/my/stats") {
        return Promise.resolve({
          data: {
            myTrees: 80,
            myPeople: 373,
            myGallery: 0,
            publicTrees: 80,
            publicBooks: 9,
            events: 795,
          },
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("renders real admin statistics correctly for Super Admin", async () => {
    mockUser = { id: 1, email: "karim@rootstunisia.com", role: 3, roleName: "super_admin" };

    render(
      <MemoryRouter>
        <TranslationProvider>
          <Dashboard />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument(); // real users
      expect(screen.getByText("80")).toBeInTheDocument(); // real trees
      expect(screen.getByText("373")).toBeInTheDocument(); // real people
      expect(screen.getByText("71")).toBeInTheDocument(); // real gallery
    });
  });

  it("renders user-scoped stats dynamically for regular user", async () => {
    mockUser = { id: 5, email: "user@example.com", role: 2, roleName: "user" };

    mockGet.mockImplementation((url: string) => {
      if (url === "/my/activity-settings") {
        return Promise.resolve({ data: { enabled: true } });
      }
      if (url === "/my/quotas") {
        return Promise.resolve({
          data: {
            tierName: "Zitouna",
            limits: {
              trees: { used: 3, max: 10 },
              individuals: { used: 12, max: 200 },
              gallery: { used: 5, max: 50 },
            },
          },
        });
      }
      if (url === "/my/stats") {
        return Promise.resolve({
          data: {
            myTrees: 3,
            myPeople: 12,
            myGallery: 5,
            publicTrees: 80,
            publicBooks: 9,
            events: 18,
          },
        });
      }
      if (url === "/my/activity") {
        return Promise.resolve({
          data: [
            {
              type: "tree_updated",
              description: "Updated branch details",
              created_at: "2026-11-11T10:00:00Z",
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter>
        <TranslationProvider>
          <Dashboard />
        </TranslationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // myTrees
      expect(screen.getByText("12")).toBeInTheDocument(); // myPeople
      expect(screen.getByText("5")).toBeInTheDocument(); // myGallery
    });
  });
});
