import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TranslationProvider, useTranslation } from "./TranslationContext";
import { tForLocale, isRtlLocale } from "../utils/translations";

function TestTranslationConsumer() {
  const { locale, setLocale, dir, t } = useTranslation();
  return (
    <div>
      <span data-testid="locale-val">{locale}</span>
      <span data-testid="dir-val">{dir}</span>
      <span data-testid="trans-home">{t("nav_home", "Home")}</span>
      <button data-testid="set-ar" onClick={() => setLocale("ar")}>
        Switch Arabic
      </button>

      <button data-testid="set-fr" onClick={() => setLocale("fr")}>
        Switch French
      </button>
    </div>
  );
}

describe("TranslationContext & translations.ts", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("correctly identifies RTL locales", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("fr")).toBe(false);
    expect(isRtlLocale("en")).toBe(false);
  });

  it("resolves translation strings with fallback", () => {
    const resEn = tForLocale("en", "nav_home", "Home");
    expect(resEn).toBeDefined();

    const resAr = tForLocale("ar", "nav_home", "الرئيسية");
    expect(resAr).toBeDefined();
  });

  it("dynamically changes locale and updates direction attribute", () => {
    render(
      <TranslationProvider>
        <TestTranslationConsumer />
      </TranslationProvider>
    );

    expect(screen.getByTestId("locale-val").textContent).toBe("en");
    expect(screen.getByTestId("dir-val").textContent).toBe("ltr");

    fireEvent.click(screen.getByTestId("set-ar"));

    expect(screen.getByTestId("locale-val").textContent).toBe("ar");
    expect(screen.getByTestId("dir-val").textContent).toBe("rtl");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});
