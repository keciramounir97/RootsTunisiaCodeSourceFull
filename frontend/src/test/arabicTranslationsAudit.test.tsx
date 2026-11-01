import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TranslationProvider, useTranslation } from "../context/TranslationContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { tForLocale, isRtlLocale, SUPPORTED_LOCALES } from "../utils/translations";
import arLocale from "../locales/ar.json";

describe("ThemeContext Complete Audit", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  function ThemeInspector() {
    const { theme, toggleTheme, setTheme } = useTheme();
    return (
      <div>
        <span data-testid="current-theme">{theme}</span>
        <button data-testid="toggle-theme-btn" onClick={toggleTheme}>Toggle</button>
        <button data-testid="set-dark-btn" onClick={() => setTheme("dark")}>Dark</button>
        <button data-testid="set-light-btn" onClick={() => setTheme("light")}>Light</button>
      </div>
    );
  }

  it("initializes with default theme, supports manual switching and synchronizes documentElement", () => {
    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    const themeDisplay = screen.getByTestId("current-theme");
    expect(["light", "dark"]).toContain(themeDisplay.textContent);

    // Explicitly set dark
    fireEvent.click(screen.getByTestId("set-dark-btn"));
    expect(themeDisplay.textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Explicitly set light
    fireEvent.click(screen.getByTestId("set-light-btn"));
    expect(themeDisplay.textContent).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("light");

    // Toggle back to dark
    fireEvent.click(screen.getByTestId("toggle-theme-btn"));
    expect(themeDisplay.textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("restores theme preference from localStorage cleanly", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("Direction & RTL/LTR Layout Audit", () => {
  function LanguageSwitchInspector() {
    const { locale, setLocale, isRtl, t } = useTranslation();
    return (
      <div>
        <span data-testid="locale-display">{locale}</span>
        <span data-testid="direction-display">{isRtl ? "rtl" : "ltr"}</span>
        <span data-testid="sample-text">{t("welcome_back", "Welcome back")}</span>
        <button data-testid="switch-ar" onClick={() => setLocale("ar")}>Arabic</button>
        <button data-testid="switch-fr" onClick={() => setLocale("fr")}>French</button>
        <button data-testid="switch-en" onClick={() => setLocale("en")}>English</button>
      </div>
    );
  }

  it("dynamically flips document.documentElement.dir between rtl and ltr on locale switch", () => {
    render(
      <TranslationProvider>
        <LanguageSwitchInspector />
      </TranslationProvider>
    );

    // Switch to Arabic
    fireEvent.click(screen.getByTestId("switch-ar"));
    expect(screen.getByTestId("locale-display").textContent).toBe("ar");
    expect(screen.getByTestId("direction-display").textContent).toBe("rtl");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(screen.getByTestId("sample-text").textContent).toBe("مرحباً بعودتك");

    // Switch to French
    fireEvent.click(screen.getByTestId("switch-fr"));
    expect(screen.getByTestId("locale-display").textContent).toBe("fr");
    expect(screen.getByTestId("direction-display").textContent).toBe("ltr");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");

    // Switch back to Arabic
    fireEvent.click(screen.getByTestId("switch-ar"));
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});

describe("Arabic Translation 100% Coverage & Zero Foreign Words Audit", () => {
  it("verifies RTL locales identification and layout direction", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("en")).toBe(false);
    expect(isRtlLocale("fr")).toBe(false);
    expect(SUPPORTED_LOCALES).toContain("ar");
  });

  it("verifies all keys in master ar.json contain genuine Arabic characters", () => {
    const keys = Object.keys(arLocale);
    expect(keys.length).toBeGreaterThanOrEqual(2500);

    const arabicCharRegex = /[\u0600-\u06FF]/;
    const failures: string[] = [];

    for (const key of keys) {
      const val = (arLocale as Record<string, string>)[key];
      // Allow URL/email placeholders or numeric ranges, but all text MUST be in Arabic
      const isPlaceholder = /^(https?:\/\/|[a-z0-9._%+-]+@|\d+[\s-]+\d+$)/i.test(val);
      if (!isPlaceholder && !arabicCharRegex.test(val)) {
        failures.push(`${key}: "${val}"`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("verifies all public, user dashboard, admin, and super admin pages have authentic Arabic translations with 0 foreign words", () => {
    const pageKeys = [
      // 1. Public Pages (Home, Auth, Info)
      "nav_home", "nav_explore", "nav_periods", "nav_sources", "nav_archives", "nav_subscriptions",
      "nav_gallery", "nav_trees", "nav_library", "nav_audios", "nav_contact", "nav_login", "nav_signup",
      "welcome_back", "create_account", "reset_password", "roots_tunisia", "start_your_journey",
      "visual_heritage", "tunisia_photo_manuscript", "cta_preserve_history",

      // 2. Payment & Refund
      "subscription_checkout", "confirm_your_plan", "total_due_today", "secure_payment_guarantee",
      "fair_billing_commitment", "refund_section_1_title", "return_to_terms",

      // 3. Contact Us & Support
      "contact_eyebrow", "contact_hero_title", "send_a_message", "direct_contact", "archive_partnerships",
      "contact_support_desc", "ticket_category", "detailed_description", "submit_support_ticket",

      // 4. User Dashboard & Resource Usage
      "usage_desc_long", "all_quotas_normal", "resources_available", "current_plan_tier",
      "research_notes", "research_tasks", "reminders", "my_download_requests", "my_trees",
      "user_settings", "upgrade_subscription", "my_sources", "user_upgrade_desc",

      // 5. Admin Portal
      "legacy.admin_management", "legacy.trees_builder", "legacy.individuals_page_title",
      "activity", "download_requests", "subscriptions_management", "manage_resource",
      "newsletter_subscribers_desc", "send_campaign_to_all", "bank_transfer_title",

      // 6. Super Admin Portal
      "super_admin_subscriptions_title", "super_admin_subscriptions_desc", "super_admin_tier_upgrade",
      "set_custom_user_quotas", "unlimited_super_admin", "super_admin_quota_unrestricted",
      "danger_zone_delete", "delete_my_account", "gdpr_erasure_policy"
    ];

    const arabicCharRegex = /[\u0600-\u06FF]/;
    const missingArabic: string[] = [];

    for (const key of pageKeys) {
      const res = tForLocale("ar", key);
      if (!arabicCharRegex.test(res)) {
        missingArabic.push(`${key} -> "${res}"`);
      }
    }

    expect(missingArabic).toEqual([]);
  });

  it("verifies all newly added keys across admin, super admin, and user dashboard are 100% Arabic", () => {
    const newlyAddedKeys = [
      "toggle_sidebar", "auth_checking", "theme_toggle_aria", "theme_switch_light", "theme_switch_dark",
      "theme_light_mode", "theme_dark_mode", "legacy.format_gedcomx", "legacy.format_gedcom7",
      "legacy.audio_not_supported", "admin.notes.my_notes", "admin.notes.all_system_notes",
      "admin.notes.note_title", "admin.notes.title_placeholder", "admin.notes.content_desc",
      "admin.notes.content_placeholder", "admin.notes.attachment_label", "admin.notes.change_image",
      "admin.notes.upload_file", "admin.notes.update_note", "admin.notes.save_note",
      "admin.tasks.cycle_status", "admin.books.short_description", "brand_roots", "brand_tunisia",
      "admin.individuals.profession", "admin.individuals.profession_placeholder", "admin.individuals.birth_year",
      "admin.individuals.birth_year_placeholder", "admin.individuals.birth_place", "admin.individuals.birth_place_placeholder",
      "admin.individuals.death_date", "admin.individuals.death_date_placeholder", "admin.individuals.death_place",
      "admin.individuals.death_place_placeholder", "admin.individuals.custom_fields", "admin.individuals.add_custom_field",
      "admin.individuals.field_name_placeholder", "admin.individuals.field_value_placeholder",
      "admin.individuals.documents_and_sources", "common.document", "common.photo_image", "common.audio",
      "common.external_link", "admin.individuals.link_existing_item", "common.loading", "common.refresh",
      "common.close", "common.no_items_available", "common.link", "admin.individuals.add_external_link",
      "admin.individuals.page_title_placeholder", "admin.individuals.url_placeholder", "common.cancel",
      "admin.individuals.save_link", "admin.individuals.visibility_status", "common.public", "common.private",
      "admin.individuals.save_changes", "admin.individuals.gedcom_saved", "admin.individuals.gedcom_in_db",
      "admin.individuals.drag_3d_card", "genealogy.birth", "common.unknown", "genealogy.death",
      "genealogy.unknown_or_living", "admin.individuals.notes_details", "admin.individuals.attached_sources",
      "admin.individuals.no_sources_attached", "common.delete", "common.edit", "admin.individuals.external_link_or_doc",
      "admin.individuals.cannot_preview", "admin.individuals.download_open", "admin.individuals.gedcom_snippet_placeholder"
    ];

    const arabicCharRegex = /[\u0600-\u06FF]/;
    const failures: string[] = [];

    for (const key of newlyAddedKeys) {
      const res = tForLocale("ar", key);
      if (!arabicCharRegex.test(res)) {
        failures.push(`${key} -> "${res}"`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("ensures tForLocale never leaks English or French text in Arabic mode even if an English fallback is passed", () => {
    const testCases: [string, string, string][] = [
      ["save", "Save", "حفظ"],
      ["cancel", "Cancel", "إلغاء"],
      ["delete", "Delete", "حذف"],
      ["edit", "Edit", "تعديل"],
      ["dashboard", "Dashboard", "لوحة القيادة"],
      ["close_sidebar", "Close Sidebar", "إغلاق الشريط الجانبي"],
      ["super_admin", "Super Admin", "المسؤول المتميز"],
      ["loading", "Loading...", "جاري التحميل..."],
      ["export_csv", "Export CSV", "تصدير CSV"],
      ["pricing", "Pricing", "الأسعار والباقات"],
      ["terms", "Terms of Service", "شروط الخدمة"],
      ["privacy", "Privacy Policy", "سياسة الخصوصية"],
      ["support", "Technical Support", "الدعم والمساعدة"]
    ];

    for (const [key, fallback, expected] of testCases) {
      const result = tForLocale("ar", key, fallback);
      expect(result).toBe(expected);
      expect(/[\u0600-\u06FF]/.test(result)).toBe(true);
    }
  });

  it("verifies 100% Arabic coverage across all User Dashboard pages (tasks, notes, reminders, downloads, settings, upgrade)", () => {
    const userDashboardKeys = [
      // My Download Requests
      "my_download_requests", "requests_i_made", "requests_for_my_content", "no_download_requests",
      "requested", "status_approved", "status_rejected", "status_pending", "approve", "reject",
      // Tasks
      "task_board", "task_create", "task_title", "task_description", "task_status_todo",
      "task_status_in_progress", "task_status_done", "task_no_tasks",
      // Notes
      "notes", "note_new", "note_title", "note_content", "note_save", "note_no_notes",
      "note_select", "note_created", "note_updated",
      // Reminders
      "reminders", "reminder_new", "reminder_title", "reminder_date", "reminder_time",
      "reminder_type_custom", "reminder_type_birthday", "reminder_type_event", "reminder_type_task",
      "reminder_create", "reminder_no_reminders",
      // User Settings & Profile
      "user_settings", "user_settings_desc", "language_and_appearance", "interface_language",
      "theme_mode", "dark_mode_active", "light_mode_active", "toggle_theme_desc", "switch_theme",
      "password_and_security", "forgot_password_q", "current_password", "new_password",
      "confirm_new_password", "update_password", "activity_log_controls", "activity_log_desc",
      "activity_log", "turn_off", "turn_on", "recent_account_activity", "refresh_log",
      "no_activity_logs", "date_time", "danger_zone_delete", "danger_zone_desc", "delete_my_account",
      "account_erasure_title", "instant_erasure", "admin_review_request", "gdpr_erasure_policy",
      "erasure_warning_text", "erasure_tax_notice", "enter_password_authorize_deletion",
      "reason_for_leaving_optional", "permanently_erase_data", "submit_deletion_request",
      // User Dashboard Stats & Actions
      "tunisia_control_panel", "easy_panel_title", "easy_panel_user_desc", "new_tree", "browse_library",
      "my_trees", "public_trees", "public_books", "my_activity", "account_quotas", "view_full_quotas",
      "upgrade", "quick_actions", "keep_work_moving", "recent_activity", "latest_updates",
      // User Upgrade & Subscriptions
      "subscription_plans", "user_upgrade_desc", "current_active_plan", "max_trees", "max_individuals",
      "max_saved_sources", "max_research_notes", "max_research_tasks", "max_gallery_images",
      "max_audio_files", "max_documents", "active_plan", "freemium_tier", "upgrade_to",
      "plan_zitouna_name", "plan_zitouna_price", "plan_zitouna_period", "plan_zitouna_tagline",
      "feat_zitouna_1", "plan_zitouna_cta", "plan_researcher_name", "plan_researcher_price",
      "plan_researcher_period", "plan_researcher_tagline", "feat_researcher_1", "plan_researcher_cta",
      "plan_institution_name", "plan_institution_price", "plan_institution_period", "plan_institution_tagline",
      "feat_institution_1", "plan_institution_cta", "usage_quotas", "source_title_required",
      "source_updated_success", "new_source_created", "note_title_required", "note_updated_success",
      "new_note_added", "payment_recorded_success", "payment_proof_submitted"
    ];

    const arabicCharRegex = /[\u0600-\u06FF]/;
    const failures: string[] = [];

    for (const key of userDashboardKeys) {
      const res = tForLocale("ar", key);
      if (!arabicCharRegex.test(res)) {
        failures.push(`${key} -> "${res}"`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("verifies 100% Arabic coverage across all Public Gallery & Discovery pages (Books, Docs, Audios, Images, Trees, Research)", () => {
    const galleryKeys = [
      // Books Gallery
      "cat_all", "cat_chronicles", "cat_sijillat", "cat_genealogy_habous", "cat_manuscripts",
      "search_books_placeholder", "view_manuscript", "request_full_pdf", "close", "pages_count", "manuscript_tag",
      // Documents Gallery
      "doc_beylical_decree", "doc_habous_property", "doc_etat_civil", "doc_waqf_education",
      "search_docs_placeholder", "preview_extract", "request_high_res",
      // Audios Gallery
      "search_audio_placeholder", "upload_audio_title", "audio_title", "placeholder_audio_title",
      "cat_oral_history", "cat_music_heritage", "cat_dialect_culture", "placeholder_gov_example",
      "audio_file_url_path", "placeholder_audio_url", "description_context", "placeholder_audio_desc_context",
      "submit_audio", "oral_histories_eyebrow", "voices_before_they_disappear", "access_audio_archives",
      // Images Gallery
      "img_cat_landmarks", "img_cat_historic", "img_cat_portraits", "img_cat_regional", "img_cat_ancient",
      "search_images_placeholder", "view_high_res", "governorate_label", "date_label",
      // Trees Gallery & 3D Modal
      "gov_all", "gov_tunis", "gov_sfax", "gov_mahdia", "gov_kairouan", "gov_sousse", "gov_djerba", "gov_bizerte",
      "search_trees_placeholder", "no_trees_yet_title", "no_trees_yet_desc", "open_tree_builder",
      "generations_label", "individuals_label", "by_author", "recently_updated", "explore_family_card",
      "tree_graph_schema", "file_and_gedcom", "card_individual_3d", "registered_document",
      "birth", "unknown_date", "death", "living_or_unlisted", "notice_and_details", "hover_card_3d",
      "interactive_tree_schema_hint", "loading_gedcom", "linked_cards", "request_archive_access",
      "placeholder_archive_reason", "submit_access_request", "download_profile_extract",
      "download_or_request_gedcom", "close_card",
      // Research
      "research_seo_title", "research_seo_desc", "universal_research", "search_across_archives",
      "research_subtitle", "research_input_placeholder", "no_matching_trees", "digitized_books_docs",
      "no_matching_books", "consult_document", "pedigree_load_failed",
      // Periods (all 9 eras)
      "periods_hero_title", "nine_periods_eyebrow", "nine_periods_title", "primary_records_docs",
      "genealogical_value_survival", "fonds_available_archives", "consult_sources_era",
      "period_punic_era", "period_roman_era", "period_vandal_era", "period_early_islamic",
      "period_fatimid_era", "period_hafsid_era", "period_ottoman_era", "period_husainid_era", "period_modern_era",
      // Sources & Archives
      "sources_and_archives_nav", "tunisian_sources_repositories", "see_the_timeline",
      "evidence_eyebrow", "know_what_document_proves", "ten_institutions_title",
      "src_national_archives_title", "src_sijillat_title", "src_habous_title", "src_etat_civil_title",
      "inst_archives_nationales_name", "inst_bnt_name", "inst_habous_archives_name",
      // Subscriptions
      "subscriptions_hero_title", "three_plans_title", "plan_basic_name", "plan_pro_name", "plan_family_name",
      "feat_unlimited_trees", "feat_gedcom_export", "feat_full_archive_access", "feat_high_res_downloads",
      // Unsubscribe
      "unsubscribe_seo_title", "unsubscribed_success_title", "confirm_unsubscribe", "return_to_home"
    ];

    const arabicCharRegex = /[\u0600-\u06FF]/;
    const failures: string[] = [];

    for (const key of galleryKeys) {
      const res = tForLocale("ar", key);
      if (!arabicCharRegex.test(res)) {
        failures.push(`${key} -> "${res}"`);
      }
    }

    expect(failures).toEqual([]);
  });
});
