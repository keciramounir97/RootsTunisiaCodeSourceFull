import { api } from "../../api/client";

export const fetchStats = async () => {
  try {
    const { data } = await api.get("/admin/stats");
    return data?.data && typeof data.data === "object" ? data.data : data;
  } catch (err) {
    console.warn("Retrying fetchStats with /stats fallback:", err);
    try {
      const { data } = await api.get("/stats");
      return data?.data && typeof data.data === "object" ? data.data : data;
    } catch (fallbackErr) {
      console.error("Failed to fetch admin stats", fallbackErr);
      return {
        users: 0,
        books: 0,
        trees: 0,
        people: 0,
        gallery: 0,
        activity: 0,
        events: 0,
        publicTrees: 0,
        privateTrees: 0,
        libraryItems: 0,
      };
    }
  }
};

export const fetchUserStats = async () => {
  try {
    const { data } = await api.get("/my/stats");
    return data?.data && typeof data.data === "object" ? data.data : data;
  } catch (err) {
    console.error("Failed to fetch user stats", err);
    return null;
  }
};

export const fetchRecentActivity = async () => {
  try {
    const { data } = await api.get("/activity");
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  } catch (err) {
    console.error("Failed to fetch recent activity", err);
    return [];
  }
};
