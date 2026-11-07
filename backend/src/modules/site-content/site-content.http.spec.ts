import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as fs from "fs";
import * as path from "path";
import request = require("supertest");
import { ActivityService } from "../activity/activity.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SITE_CONTENT_UPLOADS_DIR } from "../../common/utils/file.utils";
import {
  AdminSiteContentController,
  PublicSiteContentController,
} from "./site-content.controller";
import { SiteContentService } from "./site-content.service";

/** Minimal in-memory knex double covering what SiteContentService uses. */
function fakeKnex() {
  const tables: Record<string, any[]> = {};
  const k: any = (name: string) => {
    tables[name] ??= [];
    let filter: Record<string, any> = {};
    const matches = (row: any) => Object.entries(filter).every(([a, b]) => row[a] === b);
    const builder: any = {
      where(f: Record<string, any>) {
        filter = f;
        return builder;
      },
      async first() {
        return tables[name].find(matches);
      },
      async update(values: any) {
        tables[name].filter(matches).forEach((row) => Object.assign(row, values));
      },
      async delete() {
        tables[name] = tables[name].filter((row) => !matches(row));
      },
      async insert(values: any) {
        tables[name].push({ ...values });
      },
    };
    return builder;
  };
  k.schema = { hasTable: async () => true, createTable: async () => undefined };
  k.fn = { now: () => new Date() };
  k.tables = tables;
  return k;
}

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("Public Content Manager HTTP API", () => {
  let app: INestApplication;
  let knex: any;
  const uploaded: string[] = [];

  beforeAll(async () => {
    knex = fakeKnex();
    const moduleRef = await Test.createTestingModule({
      controllers: [AdminSiteContentController, PublicSiteContentController],
      providers: [
        SiteContentService,
        { provide: "KnexConnection", useValue: knex },
        { provide: ActivityService, useValue: { log: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: any) => {
          const req = ctx.switchToHttp().getRequest();
          const role = req.headers["x-role"];
          if (!role) return false;
          req.user = { id: 7, role_id: role === "admin" ? 1 : 2 };
          return true;
        },
      })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    uploaded.forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));
    await app.close();
  });

  it("protects admin routes (no token / non-admin)", async () => {
    await request(app.getHttpServer()).get("/admin/site-content").expect(403);
    await request(app.getHttpServer()).get("/admin/site-content").set("x-role", "user").expect(403);
    await request(app.getHttpServer())
      .put("/admin/site-content")
      .set("x-role", "user")
      .send({ pages: [] })
      .expect(403);
  });

  it("serves the seeded schema to admins and an empty public projection", async () => {
    const admin = await request(app.getHttpServer())
      .get("/admin/site-content")
      .set("x-role", "admin")
      .expect(200);
    expect(admin.body.pages.map((p: any) => p.id)).toEqual([
      "home", "about", "gallery", "library", "audio", "documents", "contact", "research",
    ]);
    const pub = await request(app.getHttpServer()).get("/site-content").expect(200);
    expect(pub.body.pages).toEqual({});
  });

  it("persists edits (PUT), exposes only overrides publicly, rejects bad input", async () => {
    const { body: doc } = await request(app.getHttpServer())
      .get("/admin/site-content")
      .set("x-role", "admin");
    const home = doc.pages.find((p: any) => p.id === "home");
    const title = home.sections.find((s: any) => s.id === "hero").fields.find((f: any) => f.key === "title");
    title.value = "Racines de Tunisie";
    title.translations = { en: "Roots of Tunisia" };
    const about = doc.pages.find((p: any) => p.id === "about");
    const body = about.sections.find((s: any) => s.id === "mission").fields.find((f: any) => f.key === "body");
    body.value = '<p onclick="x()">Hello<script>alert(1)</script></p>';

    const saved = await request(app.getHttpServer())
      .put("/admin/site-content")
      .set("x-role", "admin")
      .send({ pages: doc.pages })
      .expect(200);
    expect(saved.body.updatedAt).toBeTruthy();

    const pub = await request(app.getHttpServer()).get("/site-content").expect(200);
    expect(pub.body.pages.home.hero.title).toEqual({
      type: "text",
      value: "Racines de Tunisie",
      translations: { en: "Roots of Tunisia" },
    });
    expect(pub.body.pages.about.mission.body.value).toBe("<p>Hello</p>");
    expect(Object.keys(pub.body.pages)).toEqual(["home", "about"]);

    await request(app.getHttpServer())
      .put("/admin/site-content")
      .set("x-role", "admin")
      .send({ pages: "nope" })
      .expect(400);
  });

  it("uploads images to /uploads/site-content, rejects non-images, cleans orphans on save", async () => {
    const res = await request(app.getHttpServer())
      .post("/admin/site-content/upload")
      .set("x-role", "admin")
      .attach("image", PNG_1X1, { filename: "hero.png", contentType: "image/png" })
      .expect(201);
    expect(res.body.url).toMatch(/^\/uploads\/site-content\/sc-[a-f0-9]{32}\.png$/);
    expect(res.body.width).toBe(1);
    const file = path.join(SITE_CONTENT_UPLOADS_DIR, res.body.filename);
    uploaded.push(file);
    expect(fs.existsSync(file)).toBe(true);
    expect((await app.get(SiteContentService).getAsset(res.body.filename))?.mimeType).toBe("image/png");

    await request(app.getHttpServer())
      .post("/admin/site-content/upload")
      .set("x-role", "admin")
      .attach("image", Buffer.from("not an image"), { filename: "x.txt", contentType: "text/plain" })
      .expect(400);

    const { body: doc } = await request(app.getHttpServer())
      .get("/admin/site-content")
      .set("x-role", "admin");
    const img = doc.pages
      .find((p: any) => p.id === "contact")
      .sections.find((s: any) => s.id === "hero")
      .fields.find((f: any) => f.key === "image");
    img.value = res.body.url;
    await request(app.getHttpServer()).put("/admin/site-content").set("x-role", "admin").send({ pages: doc.pages }).expect(200);
    expect(fs.existsSync(file)).toBe(true);
    const pub = await request(app.getHttpServer()).get("/site-content");
    expect(pub.body.pages.contact.hero.image.value).toBe(res.body.url);

    img.value = "";
    await request(app.getHttpServer()).put("/admin/site-content").set("x-role", "admin").send({ pages: doc.pages }).expect(200);
    expect(fs.existsSync(file)).toBe(false);
    expect(await app.get(SiteContentService).getAsset(res.body.filename)).toBeNull();
  });
});
