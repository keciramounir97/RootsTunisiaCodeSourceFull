import { useEffect, useRef, useState, useCallback } from "react";
import grapesjs, { type Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import {
  Blocks,
  Palette,
  Layers,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { api } from "../../../api/client";
import {
  ROOTS_TUNISIA_BLOCKS,
  TUNISIAN_ASSET_ITEMS,
  buildStarterTemplateForPage,
  type GrapesSeedContext,
} from "./grapesTemplates";

export interface GrapesBuilderPayload {
  html: string;
  css: string;
  projectJson: string;
}

interface GrapesJsBuilderProps {
  pageId: string;
  localeCode?: string;
  initialHtml?: string;
  initialCss?: string;
  initialProjectJson?: string;
  seedContext: GrapesSeedContext;
  onChange: (payload: GrapesBuilderPayload) => void;
  onSaveRequested?: (payload: GrapesBuilderPayload) => void;
  isRtl?: boolean;
}

const GJS_DARK_THEME_OVERRIDES = `
.rt-gjs-shell .gjs-one-bg {
  background-color: #0d1626 !important;
}
.rt-gjs-shell .gjs-two-color {
  color: #f1e6cf !important;
}
.rt-gjs-shell .gjs-three-bg {
  background-color: #162238 !important;
  color: #f8fafc !important;
}
.rt-gjs-shell .gjs-four-color,
.rt-gjs-shell .gjs-four-color-h:hover {
  color: #e5b85b !important;
}
.rt-gjs-shell .gjs-block {
  border: 1px solid rgba(212, 166, 80, 0.35) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border-radius: 10px !important;
  padding: 10px 8px !important;
  min-height: 76px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  color: #f8f5ef !important;
  transition: border-color 150ms ease, transform 150ms ease !important;
}
.rt-gjs-shell .gjs-block:hover {
  border-color: #e5b85b !important;
  background: rgba(212, 166, 80, 0.14) !important;
  transform: translateY(-1px);
}
.rt-gjs-shell .gjs-block-category .gjs-title {
  background: #131f33 !important;
  color: #e5b85b !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  border-bottom: 1px solid rgba(212, 166, 80, 0.25) !important;
}
.rt-gjs-shell .gjs-cv-canvas {
  background: #0a101d !important;
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
}
.rt-gjs-shell .gjs-frame-wrapper {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}
.rt-gjs-shell .gjs-pn-panels {
  display: none !important;
}
`;

export default function GrapesJsBuilder({
  pageId,
  localeCode = "default",
  initialHtml = "",
  initialCss = "",
  initialProjectJson = "",
  seedContext,
  onChange,
  onSaveRequested,
  isRtl = false,
}: GrapesJsBuilderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blocksPanelRef = useRef<HTMLDivElement | null>(null);
  const stylesPanelRef = useRef<HTMLDivElement | null>(null);
  const layersPanelRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [activeSideTab, setActiveSideTab] = useState<"blocks" | "styles" | "layers">("blocks");
  const [device, setDevice] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [statusNote, setStatusNote] = useState<string>("");
  const [canvasDir, setCanvasDir] = useState<"ltr" | "rtl">(isRtl ? "rtl" : "ltr");

  useEffect(() => {
    setCanvasDir(isRtl ? "rtl" : "ltr");
  }, [isRtl]);

  const extractPayload = useCallback((editor: Editor): GrapesBuilderPayload => {
    const rawHtml = editor.getHtml() || "";
    // Remove auto-generated empty <body> wrapper if present while preserving its inner elements
    const trimmedBody = rawHtml.replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "").trim();
    const css = (editor.getCss() || "").trim();
    let projectJson = "";
    try {
      projectJson = JSON.stringify(editor.getProjectData() || {});
    } catch {
      projectJson = "";
    }
    return {
      html: trimmedBody,
      css,
      projectJson,
    };
  }, []);

  const flashNote = useCallback((msg: string) => {
    setStatusNote(msg);
    setTimeout(() => setStatusNote((prev) => (prev === msg ? "" : prev)), 3200);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !blocksPanelRef.current || !stylesPanelRef.current || !layersPanelRef.current) {
      return;
    }

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "650px",
      width: "auto",
      fromElement: false,
      noticeOnUnload: false,
      storageManager: false,
      panels: { defaults: [] },
      blockManager: {
        appendTo: blocksPanelRef.current,
      },
      styleManager: {
        appendTo: stylesPanelRef.current,
        sectors: [
          {
            name: "Typographie",
            open: true,
            buildProps: [
              "font-family",
              "font-size",
              "font-weight",
              "color",
              "line-height",
              "text-align",
            ],
          },
          {
            name: "Espacement & Taille",
            open: false,
            buildProps: [
              "width",
              "max-width",
              "min-height",
              "padding",
              "margin",
            ],
          },
          {
            name: "Arrière-plan & Bordures",
            open: false,
            buildProps: [
              "background-color",
              "border-radius",
              "border",
              "box-shadow",
            ],
          },
        ],
      },
      layerManager: {
        appendTo: layersPanelRef.current,
      },
      deviceManager: {
        devices: [
          { id: "Desktop", name: "Ordinateur", width: "" },
          { id: "Tablet", name: "Tablette", width: "768px", widthMedia: "992px" },
          { id: "Mobile", name: "Mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      assetManager: {
        assets: TUNISIAN_ASSET_ITEMS,
        uploadFile: async (e: DragEvent | Event) => {
          const inputFiles =
            (e as DragEvent).dataTransfer?.files ||
            (e.target as HTMLInputElement)?.files;
          if (!inputFiles || inputFiles.length === 0) return;
          const file = inputFiles[0];
          const formData = new FormData();
          formData.append("image", file);
          try {
            setUploadingAsset(true);
            const { data } = await api.post("/admin/site-content/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            const uploadedUrl = data?.url || data?.data?.url;
            if (uploadedUrl) {
              editor.AssetManager.add([{ src: uploadedUrl, name: file.name, type: "image" }]);
              flashNote("Image tunisienne ajoutée au constructeur.");
            }
          } catch {
            flashNote("Échec du téléversement de l'image.");
          } finally {
            setUploadingAsset(false);
          }
        },
      },
      canvas: {
        styles: [],
      },
    });

    // Register bespoke Roots Tunisia blocks
    ROOTS_TUNISIA_BLOCKS.forEach((blk) => {
      editor.BlockManager.add(blk.id, {
        label: blk.label,
        category: blk.category,
        content: blk.content,
      });
    });

    // Load saved state OR populate editable starter layout from active CMS fields
    let loaded = false;
    if (initialProjectJson && initialProjectJson.trim()) {
      try {
        const parsed = JSON.parse(initialProjectJson);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.pages)) {
          editor.loadProjectData(parsed);
          loaded = true;
        }
      } catch {
        loaded = false;
      }
    }

    if (!loaded) {
      if (initialHtml && initialHtml.trim()) {
        editor.setComponents(initialHtml);
        if (initialCss && initialCss.trim()) {
          editor.setStyle(initialCss);
        }
      } else {
        const starter = buildStarterTemplateForPage(seedContext);
        editor.setComponents(starter.html);
        editor.setStyle(starter.css);
      }
    }

    // Apply initial RTL direction to canvas root if requested
    editor.on("load", () => {
      const docEl = editor.Canvas.getDocument()?.documentElement;
      if (docEl) {
        docEl.setAttribute("dir", canvasDir);
      }
    });

    let emitTimer: number | null = null;
    const notifyParent = () => {
      if (emitTimer) window.clearTimeout(emitTimer);
      emitTimer = window.setTimeout(() => {
        onChangeRef.current(extractPayload(editor));
      }, 180);
    };

    const events = [
      "component:add",
      "component:remove",
      "component:update",
      "style:change",
      "canvas:drop",
      "undo",
      "redo",
    ];
    events.forEach((ev) => editor.on(ev, notifyParent));

    editorRef.current = editor;

    return () => {
      if (emitTimer) window.clearTimeout(emitTimer);
      events.forEach((ev) => editor.off(ev, notifyParent));
      try {
        editor.destroy();
      } catch {
        // Safe cleanup if DOM detached rapidly during navigation
      }
      editorRef.current = null;
    };
    // Re-initialize canvas only when active page or active language changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, localeCode]);

  // Keep canvas RTL direction synchronized dynamically without resetting editor state
  useEffect(() => {
    const docEl = editorRef.current?.Canvas.getDocument()?.documentElement;
    if (docEl) {
      docEl.setAttribute("dir", canvasDir);
    }
  }, [canvasDir]);

  const handleDeviceSwitch = (next: "Desktop" | "Tablet" | "Mobile") => {
    setDevice(next);
    editorRef.current?.setDevice(next);
  };

  const handleUndo = () => {
    editorRef.current?.UndoManager.undo();
  };

  const handleRedo = () => {
    editorRef.current?.UndoManager.redo();
  };

  const handleLoadStarter = () => {
    if (!editorRef.current) return;
    const starter = buildStarterTemplateForPage(seedContext);
    editorRef.current.setComponents(starter.html);
    editorRef.current.setStyle(starter.css);
    const payload = extractPayload(editorRef.current);
    onChange(payload);
    flashNote("Modèle tunisien chargé sur le canevas.");
  };

  const handleClearCanvas = () => {
    if (!editorRef.current) return;
    editorRef.current.setComponents("");
    editorRef.current.setStyle("");
    const emptyPayload: GrapesBuilderPayload = { html: "", css: "", projectJson: "" };
    onChange(emptyPayload);
    flashNote("Blocs visuels personnalisés effacés (cliquez Publier pour appliquer).");
  };

  const handleManualImageUpload = async (files: FileList | null) => {
    if (!files || !files.length || !editorRef.current) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploadingAsset(true);
      const { data } = await api.post("/admin/site-content/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = data?.url || data?.data?.url;
      if (url) {
        editorRef.current.AssetManager.add([{ src: url, name: file.name, type: "image" }]);
        editorRef.current.runCommand("open-assets");
        flashNote("Image téléversée avec succès !");
      }
    } catch {
      flashNote("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploadingAsset(false);
    }
  };

  return (
    <div className="rt-gjs-shell rounded-xl border border-[var(--gold)]/35 bg-[#0d1626] text-slate-100 overflow-hidden shadow-2xl">
      <style>{GJS_DARK_THEME_OVERRIDES}</style>

      {/* Senior-Friendly Top GrapesJS Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#101c30] border-b border-[var(--gold)]/25">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSideTab("blocks")}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSideTab === "blocks"
                ? "bg-[var(--gold)] text-[#1a1308]"
                : "bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <Blocks className="h-4 w-4" />
            <span>Blocs Tunisie</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSideTab("styles")}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSideTab === "styles"
                ? "bg-[var(--gold)] text-[#1a1308]"
                : "bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Styles & Couleurs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSideTab("layers")}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSideTab === "layers"
                ? "bg-[var(--gold)] text-[#1a1308]"
                : "bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Calques</span>
          </button>

          <div className="h-6 w-px bg-white/15 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={handleUndo}
            title="Annuler la dernière modification"
            className="p-2 rounded-lg bg-white/5 text-slate-200 hover:bg-white/10 cursor-pointer"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            title="Rétablir"
            className="p-2 rounded-lg bg-white/5 text-slate-200 hover:bg-white/10 cursor-pointer"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Device Responsive Switcher */}
        <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-lg border border-white/10">
          {(
            [
              { id: "Desktop", label: "Bureau", Icon: Monitor },
              { id: "Tablet", label: "Tablette", Icon: Tablet },
              { id: "Mobile", label: "Mobile", Icon: Smartphone },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleDeviceSwitch(id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                device === id
                  ? "bg-[var(--gold)] text-[#1a1308] font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Utility Actions: Upload Photo, Starter Template, Clear, Publish */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleManualImageUpload(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            disabled={uploadingAsset}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{uploadingAsset ? "Envoi..." : "Ajouter Photo"}</span>
          </button>

          <button
            type="button"
            onClick={() => setCanvasDir((d) => (d === "rtl" ? "ltr" : "rtl"))}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              canvasDir === "rtl"
                ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)]"
                : "border-white/15 bg-white/5 text-slate-300"
            }`}
          >
            {canvasDir === "rtl" ? "RTL (العربية)" : "LTR"}
          </button>

          <button
            type="button"
            onClick={handleLoadStarter}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/35 hover:bg-emerald-500/25 text-xs font-semibold text-emerald-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Modèle Tunisie</span>
          </button>

          <button
            type="button"
            onClick={handleClearCanvas}
            title="Supprimer les blocs visuels personnalisés de cette page"
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-400/30 hover:bg-rose-500/20 text-xs font-semibold text-rose-200 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Vider</span>
          </button>

          {onSaveRequested && (
            <button
              type="button"
              onClick={() => {
                if (editorRef.current) {
                  const payload = extractPayload(editorRef.current);
                  onChange(payload);
                  onSaveRequested(payload);
                }
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--gold)] hover:brightness-110 text-[#1a1308] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Publier Visuel</span>
            </button>
          )}
        </div>
      </div>

      {/* Gentle Usage Guide Strip for Elderly / Non-Technical Admins */}
      <div className="px-4 py-2 bg-[#14223a] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[var(--gold)] shrink-0" />
          <span>
            <strong>Mode visuel simple :</strong> Glissez un bloc de gauche sur la page,{" "}
            <strong className="text-white">double-cliquez sur un texte</strong> pour le modifier ou
            sur une photo pour choisir une image de Tunisie, puis cliquez sur{" "}
            <strong className="text-[var(--gold)]">Enregistrer / Publier</strong>.
          </span>
        </div>
        {statusNote && (
          <span className="text-emerald-300 font-semibold">{statusNote}</span>
        )}
      </div>

      {/* Main Workspace: Left Palette + Live GrapesJS Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        <aside className="lg:col-span-3 border-e border-[var(--gold)]/20 bg-[#0f192b] max-h-[660px] overflow-y-auto p-3">
          <div
            ref={blocksPanelRef}
            className={activeSideTab === "blocks" ? "block" : "hidden"}
          />
          <div
            ref={stylesPanelRef}
            className={activeSideTab === "styles" ? "block" : "hidden"}
          />
          <div
            ref={layersPanelRef}
            className={activeSideTab === "layers" ? "block" : "hidden"}
          />
        </aside>

        <div className="lg:col-span-9 bg-[#0a101d] min-h-[650px]">
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
}
