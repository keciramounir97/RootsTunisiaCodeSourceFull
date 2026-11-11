import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Logo } from "./Logo";
import { useThemeStore } from "../../store/theme";

describe("Logo", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "light" });
  });

  it("renders responsive non-collapsing image classes by default (md)", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Roots Tunisia" });
    const img = screen.getByRole("img", { name: "Roots Tunisia" });

    expect(link.className).toContain("shrink-0");
    expect(img.className).toContain("w-auto");
    expect(img.className).toContain("object-contain");
    expect(img.className).toContain("h-[clamp(28px,2.5vw+20px,42px)]");
    expect(img.getAttribute("src")).toContain("roots-tunisia-logo-light");
  });

  it("supports sm and lg size variants and switches artwork in dark theme", () => {
    useThemeStore.setState({ theme: "dark" });

    const { rerender } = render(
      <MemoryRouter>
        <Logo size="sm" />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: "Roots Tunisia" }).className).toContain(
      "h-[clamp(26px,2vw+18px,34px)]"
    );
    expect(screen.getByRole("img", { name: "Roots Tunisia" }).getAttribute("src")).toContain(
      "roots-tunisia-logo-dark"
    );

    rerender(
      <MemoryRouter>
        <Logo size="lg" />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: "Roots Tunisia" }).className).toContain(
      "h-[clamp(34px,3vw+22px,50px)]"
    );
  });
});

