import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
  defaults: { baseURL: "http://localhost:5000/api" },
}));
vi.mock("../../api/client", () => ({ api: apiMock, default: apiMock }));
vi.mock("../../hooks/useSiteContent", () => ({ refreshSiteContent: vi.fn() }));

import ContentManager from "./ContentManager";

const field = (key: string, type: string, label: string, value: any = type === "list" ? [] : "") => ({
  key,
  type,
  label,
  value,
});

const makeDoc = () => ({
  version: 1,
  updatedAt: null,
  updatedBy: null,
  pages: [
    {
      id: "home",
      label: "Home",
      path: "/",
      sections: [
        {
          id: "hero",
          label: "Hero banner",
          fields: [
            field("title", "text", "Heading"),
            field("image", "image", "Hero image"),
            field("body", "html", "Body"),
            field("items", "list", "Bullets"),
          ],
        },
        { id: "cta", label: "Final call to action", fields: [field("title", "text", "CTA heading")] },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      sections: [{ id: "details", label: "Contact details", fields: [field("email", "text", "E-mail")] }],
    },
  ],
});

const headingInput = () =>
  screen.getAllByPlaceholderText(/built-in site text|texte intégré/i).find((el) => el.tagName === "INPUT")!;

describe("ContentManager", () => {
  beforeEach(() => {
    vi.spyOn(localStorage, "setItem");
    apiMock.get.mockReset().mockResolvedValue({ data: { data: makeDoc() } });
    apiMock.put.mockReset();
    apiMock.post.mockReset();
  });

  it("loads from the API, edits per language, uploads an image and saves via PUT (no localStorage)", async () => {
    apiMock.post.mockResolvedValue({ data: { data: { url: "/uploads/site-content/sc-abc.png" } } });
    apiMock.put.mockImplementation(async (_url: string, body: any) => ({
      data: { data: { ...makeDoc(), updatedAt: "2026-11-07T20:00:00.000Z", pages: body.pages } },
    }));

    const { container } = render(<ContentManager />);
    await screen.findByText(/Public Content Manager|Gestionnaire de contenu public/i);
    expect(apiMock.get).toHaveBeenCalledWith("/admin/site-content");

    const save = screen.getByRole("button", { name: /save & publish|enregistrer/i });
    expect(save).toBeDisabled();

    // Edit the heading (all languages) + a French override
    const heading = headingInput();
    fireEvent.change(heading, { target: { value: "Roots Tunisia" } });
    expect(save).toBeEnabled();
    fireEvent.click(screen.getByRole("tab", { name: /FR/ }));
    fireEvent.change(screen.getByPlaceholderText("Roots Tunisia"), { target: { value: "Racines de Tunisie" } });

    // Upload an image under "All languages"
    fireEvent.click(screen.getByRole("tab", { name: /All languages|Toutes les langues/i }));
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "hero.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(apiMock.post).toHaveBeenCalled());
    expect(apiMock.post.mock.calls[0][0]).toBe("/admin/site-content/upload");
    expect((apiMock.post.mock.calls[0][1] as FormData).get("image")).toBeInstanceOf(File);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/uploads\/site-content/)).toHaveValue("/uploads/site-content/sc-abc.png"),
    );

    // List item
    fireEvent.click(screen.getByRole("button", { name: /add item|ajouter/i }));
    fireEvent.change(within(screen.getByText("1").parentElement!).getByRole("textbox"), {
      target: { value: "First bullet" },
    });

    // Switch section + page: draft survives navigation
    fireEvent.click(screen.getByRole("button", { name: /Contact/ }));
    expect(screen.getByText("E-mail")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save & publish|enregistrer/i }));
    await waitFor(() => expect(apiMock.put).toHaveBeenCalledTimes(1));
    const [url, body] = apiMock.put.mock.calls[0];
    expect(url).toBe("/admin/site-content");
    const hero = body.pages[0].sections[0].fields;
    expect(hero.find((f: any) => f.key === "title")).toMatchObject({
      value: "Roots Tunisia",
      translations: { fr: "Racines de Tunisie" },
    });
    expect(hero.find((f: any) => f.key === "image").value).toBe("/uploads/site-content/sc-abc.png");
    expect(hero.find((f: any) => f.key === "items").value).toEqual(["First bullet"]);

    await screen.findByText(/content saved and published|Contenu enregistré et publié/i);
    await waitFor(() => expect(screen.getByRole("button", { name: /save & publish|enregistrer/i })).toBeDisabled());
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("keeps the draft and reports an error when saving fails", async () => {
    apiMock.put.mockRejectedValue({ response: { status: 500, data: { message: "boom" } } });
    render(<ContentManager />);
    await screen.findByText(/Public Content Manager|Gestionnaire de contenu public/i);
    fireEvent.change(headingInput(), {
      target: { value: "Draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save & publish|enregistrer/i }));
    await screen.findByText(/boom|saving failed|échec/i);
    expect(screen.getByText(/unsaved changes|modifications/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save & publish|enregistrer/i })).toBeEnabled();
  });

  it("shows a retry state when loading fails", async () => {
    apiMock.get.mockRejectedValueOnce(new Error("network"));
    render(<ContentManager />);
    const retry = await screen.findByRole("button", { name: /retry|réessayer/i });
    fireEvent.click(retry);
    await screen.findByText(/Public Content Manager|Gestionnaire de contenu public/i);
    expect(within(document.body).getAllByText(/Hero banner|Bannière/i).length).toBeGreaterThan(0);
  });
});
