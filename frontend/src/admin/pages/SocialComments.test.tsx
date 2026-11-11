import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SocialComments from "./SocialComments";
import { TranslationProvider } from "../../context/TranslationContext";

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockDelete = vi.fn();

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
    patch: (...args: any[]) => mockPatch(...args),
    delete: (...args: any[]) => mockDelete(...args),
  },
}));

describe("SocialComments Management & Monitoring", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGet.mockImplementation((url: string) => {
      if (url === "/social/admin/stats") {
        return Promise.resolve({
          data: {
            totalComments: 5,
            approvedComments: 4,
            pendingComments: 1,
            totalLikes: 14,
            uniqueLikedItems: 3,
            topLikedItems: [
              {
                media_key: "gallery_tree_124",
                entity_type: "tree",
                entity_id: 124,
                likes_count: 10,
                comments_count: 3,
                last_liked_at: "2026-11-10T20:00:00Z",
                item_title: "Xavier Cassar, pêcheur",
              },
            ],
          },
        });
      }

      if (url === "/social/admin/comments") {
        return Promise.resolve({
          data: {
            items: [
              {
                id: 101,
                media_key: "gallery_tree_124",
                entity_type: "tree",
                entity_id: 124,
                user_id: 1,
                user_name: "Karim Admin",
                user_email: "karim@rootstunisia.com",
                content: "Excellente documentation historique !",
                is_approved: 1,
                created_at: "2026-11-10T15:30:00Z",
                item_title: "Xavier Cassar, pêcheur",
              },
              {
                id: 102,
                media_key: "gallery_img_33",
                entity_type: "gallery",
                entity_id: 33,
                user_id: 2,
                user_name: "Sami Ben Ali",
                user_email: "sami@example.com",
                content: "Photo d'archive très rare.",
                is_approved: 0,
                created_at: "2026-11-10T16:00:00Z",
                item_title: "Port de Bizerte 1920",
              },
            ],
            total: 2,
            page: 1,
            limit: 25,
          },
        });
      }

      if (url === "/social/admin/likes") {
        return Promise.resolve({
          data: {
            items: [
              {
                id: 201,
                media_key: "gallery_tree_124",
                entity_type: "tree",
                entity_id: 124,
                user_id: 1,
                user_name: "Karim Admin",
                user_email: "karim@rootstunisia.com",
                created_at: "2026-11-10T18:00:00Z",
                item_title: "Xavier Cassar, pêcheur",
              },
            ],
            total: 1,
            page: 1,
            limit: 25,
          },
        });
      }

      return Promise.resolve({ data: [] });
    });

    mockPatch.mockResolvedValue({ data: { success: true, is_approved: false } });
    mockDelete.mockResolvedValue({ data: { success: true } });
  });

  it("renders live KPI metrics for Super Admin", async () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <SocialComments />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Verify KPI numbers from /social/admin/stats
    await waitFor(() => {
      expect(screen.getAllByText("14").length).toBeGreaterThan(0); // totalLikes
      expect(screen.getAllByText("5").length).toBeGreaterThan(0); // totalComments
    });
  });

  it("renders comments with author and item title, and supports approval toggling", async () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <SocialComments />
        </TranslationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Karim Admin")).toBeInTheDocument();
      expect(screen.getByText("Excellente documentation historique !")).toBeInTheDocument();
      expect(screen.getAllByText("Xavier Cassar, pêcheur").length).toBeGreaterThan(0);
    });

    // Toggle approval via table button
    const approveBtns = screen.getAllByTitle(/Cliquez pour masquer/i);
    expect(approveBtns.length).toBeGreaterThan(0);
    fireEvent.click(approveBtns[0]);

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith("/social/admin/comments/101/approve", {
        isApproved: false,
      });
    });
  });

  it("switches to Likes tab and displays like activity with user details", async () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <SocialComments />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Switch to Likes Tab
    const likesTab = screen.getByText(/Surveillance des J'aime/i);
    fireEvent.click(likesTab);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/social/admin/likes", expect.anything());
      expect(screen.getAllByText("Xavier Cassar, pêcheur").length).toBeGreaterThan(0);
    });
  });
});
