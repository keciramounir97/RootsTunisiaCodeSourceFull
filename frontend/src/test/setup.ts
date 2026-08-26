import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

// Mock localStorage in-memory for Vitest environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: storageMock,
  writable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: storageMock,
  writable: true,
});
