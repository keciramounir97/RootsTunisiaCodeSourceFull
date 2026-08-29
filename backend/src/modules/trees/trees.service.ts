import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { Tree } from '../../models/Tree';
import { Person } from '../../models/Person';
import { ActivityService } from '../activity/activity.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { resolveStoredFilePath, safeUnlink, safeMoveFile, PRIVATE_TREE_UPLOADS_DIR, TREE_UPLOADS_DIR } from '../../common/utils/file.utils';
import { detectGedcomXFormat, parseGedcomXFromJson, parseGedcomXFromXml } from '../../common/utils/gedcomx.util';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TreesService implements OnModuleInit {
    constructor(
        @Inject('KnexConnection') private readonly knex,
        private readonly activityService: ActivityService,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    async onModuleInit() {
        try {
            await this.ensureTreeSchema();
            await this.backfillGedcomText();
        } catch (err: any) {
            console.warn(`Tree schema init skipped: ${err?.message || err}`);
        }
    }

    /** One-time backfill: for existing trees whose GEDCOM lives only on disk,
     *  copy the file content into `gedcom_text` so they gain a database backup.
     *  Idempotent — only touches rows where the backup is still empty. */
    private async backfillGedcomText() {
        if (!(await this.knex.schema.hasColumn('family_trees', 'gedcom_text'))) return;
        const rows = await this.knex('family_trees')
            .whereNotNull('gedcom_path')
            .andWhere((b: any) => b.whereNull('gedcom_text').orWhere('gedcom_text', ''))
            .select('id', 'gedcom_path');
        let filled = 0;
        for (const row of rows) {
            try {
                const filePath = row.gedcom_path ? resolveStoredFilePath(row.gedcom_path) : null;
                if (!filePath || !fs.existsSync(filePath)) continue;
                const content = fs.readFileSync(filePath, 'utf8');
                if (!content) continue;
                await this.knex('family_trees').where('id', row.id).update({ gedcom_text: content });
                filled++;
            } catch (err: any) {
                console.warn(`Backfill gedcom_text skipped for tree #${row.id}: ${err?.message || err}`);
            }
        }
        if (filled) console.log(`Backfilled gedcom_text for ${filled} tree(s).`);
    }

    /** Adds the `gedcom_text` column so a full copy of each tree's GEDCOM is
     *  stored in the database, surviving even if the uploads folder is wiped. */
    private async ensureTreeSchema() {
        if (!(await this.knex.schema.hasTable('family_trees'))) return;
        if (!(await this.knex.schema.hasColumn('family_trees', 'gedcom_text'))) {
            await this.knex.schema.alterTable('family_trees', (table: any) => {
                table.text('gedcom_text', 'longtext').nullable();
            });
        }
    }

    /** Select all tree columns plus a derived flag that is true once the tree's
     *  full GEDCOM content is captured in the database (not just on disk). */
    private backupFlagSelect() {
        return [
            'family_trees.*',
            this.knex.raw(
                "(CASE WHEN family_trees.gedcom_text IS NOT NULL AND family_trees.gedcom_text <> '' THEN 1 ELSE 0 END) as has_gedcom_backup",
            ),
        ];
    }

    /** Remove the (potentially large) raw GEDCOM text from a tree object before
     *  returning it to clients — the visualizer fetches it via the /gedcom route. */
    private stripGedcomText<T>(row: T): T {
        if (row && typeof row === 'object') delete (row as any).gedcom_text;
        return row;
    }

    private treeCache = new Map<string, { data: any; expiry: number }>();
    private gedcomCache = new Map<number, { text: string; expiry: number }>();

    private getCached(key: string) {
        const item = this.treeCache.get(key);
        if (item && item.expiry > Date.now()) return item.data;
        return null;
    }

    private setCached(key: string, data: any, ttlMs = 5000) {
        this.treeCache.set(key, { data, expiry: Date.now() + ttlMs });
    }

    public clearCache() {
        this.treeCache.clear();
        this.gedcomCache.clear();
    }

    async listPublic() {
        const cached = this.getCached('public');
        if (cached) return cached;

        const countSelect = this.knex.raw('0 as people_count');

        const rows = await Tree.query(this.knex)
            .select(this.backupFlagSelect())
            .select(countSelect)
            .where((builder: any) => builder.where('is_public', true).orWhereNull('is_public'))
            .orderBy('created_at', 'desc')
            .withGraphFetched('owner')
            .modifyGraph('owner', (builder: any) => builder.select('id', 'full_name'));
        const result = rows.map((r: any) => this.stripGedcomText(r));
        this.setCached('public', result);
        return result;
    }

    async getPublic(id: number) {
        const cached = this.getCached(`tree_pub_${id}`);
        if (cached) return cached;

        const tree = await Tree.query(this.knex)
            .findById(id)
            .select(this.backupFlagSelect())
            .where((builder: any) => builder.where('is_public', true).orWhereNull('is_public'))
            .withGraphFetched('owner')
            .modifyGraph('owner', (builder: any) => builder.select('id', 'full_name'));

        if (!tree) throw new NotFoundException('Tree not found');
        const result = this.stripGedcomText(tree);
        this.setCached(`tree_pub_${id}`, result);
        return result;
    }

    async listByUser(userId: number) {
        const cacheKey = `user_${userId}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const countSelect = this.knex.raw('0 as people_count');

        const rows = await Tree.query(this.knex)
            .select(this.backupFlagSelect())
            .select(countSelect)
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .withGraphFetched('owner')
            .modifyGraph('owner', (builder: any) => builder.select('id', 'full_name', 'email'));
        const result = rows.map((r: any) => this.stripGedcomText(r));
        this.setCached(cacheKey, result);
        return result;
    }

    async listAdmin() {
        const cached = this.getCached('admin');
        if (cached) return cached;

        const countSelect = this.knex.raw('0 as people_count');

        const rows = await Tree.query(this.knex)
            .select(this.backupFlagSelect())
            .select(countSelect)
            .orderBy('created_at', 'desc')
            .withGraphFetched('owner')
            .modifyGraph('owner', (builder: any) => builder.select('id', 'full_name', 'email'));
        const result = rows.map((r: any) => this.stripGedcomText(r));
        this.setCached('admin', result);
        return result;
    }

    async findOne(id: number) {
        const cached = this.getCached(`tree_${id}`);
        if (cached) return cached;

        const tree = await Tree.query(this.knex)
            .findById(id)
            .select(this.backupFlagSelect())
            .withGraphFetched('owner');
        if (!tree) throw new NotFoundException('Tree not found');
        const result = this.stripGedcomText(tree);
        this.setCached(`tree_${id}`, result);
        return result;
    }

    async getGedcomContentDirect(id: number): Promise<string | null> {
        const cached = this.gedcomCache.get(Number(id));
        if (cached && cached.expiry > Date.now()) {
            return cached.text;
        }

        const stored = await this.knex('family_trees').where({ id }).select('gedcom_text', 'gedcom_path', 'is_public', 'title').first();
        if (!stored) return null;

        const text = stored.gedcom_text;
        if (typeof text === 'string' && text.trim().length > 0) {
            this.gedcomCache.set(Number(id), { text, expiry: Date.now() + 30000 });
            return text;
        }

        const storedPath = stored.gedcom_path;
        const filePath = storedPath ? resolveStoredFilePath(storedPath) : null;
        if (filePath && fs.existsSync(filePath)) {
            try {
                const fileText = fs.readFileSync(filePath, 'utf8');
                if (fileText) {
                    this.gedcomCache.set(Number(id), { text: fileText, expiry: Date.now() + 30000 });
                    return fileText;
                }
            } catch {}
        }
        return null;
    }

    /** Returns the tree's GEDCOM content, prioritizing the database copy
     *  (gedcom_text) to ensure live web edits load instantly, falling back to disk.
     *  Self-heals disk file if missing! */
    async getGedcomContent(tree: any): Promise<string | null> {
        return this.getGedcomContentDirect(Number(tree.id));
    }

    gedcomFileName(tree: any): string {
        const title = (tree?.title || 'family-tree').trim().replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]+/g, '_');
        return `${title || 'tree'}.ged`;
    }

    async create(data: any, userId: number, file?: Express.Multer.File) {
        if (userId) {
            await this.subscriptionsService.checkUserQuota(userId, 'trees');
        }

        const title = data.title ?? data.name;
        if (!title) {
            throw new BadRequestException('Title is required');
        }

        const isPublic = data.isPublic === 'true' || data.isPublic === true;
        let gedcomPath = file ? `/uploads/trees/${file.filename}` : null;

        let dataFormat: 'gedcom' | 'gedcomx' | 'gedcom7' = 'gedcom';
        let gedcomText: string | null = data.gedcom_text ?? data.gedcomText ?? null;
        if (file) {
            gedcomText = fs.readFileSync(file.path, 'utf8');
            const explicit = data.data_format ?? data.dataFormat;
            if (explicit === 'gedcom7' || explicit === 'gedcomx' || explicit === 'gedcom') dataFormat = explicit;
            else {
                dataFormat = this.inferDataFormat(file.originalname, gedcomText.slice(0, 4000));
            }
        } else if (gedcomText && typeof gedcomText === 'string' && gedcomText.trim().length > 0) {
            const explicit = data.data_format ?? data.dataFormat;
            if (explicit === 'gedcom7' || explicit === 'gedcomx' || explicit === 'gedcom') dataFormat = explicit;
            else {
                dataFormat = this.inferDataFormat('tree.ged', gedcomText.slice(0, 4000));
            }
            // Auto-write to disk in background
            const filename = `tree_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.ged`;
            const destDir = isPublic ? TREE_UPLOADS_DIR : PRIVATE_TREE_UPLOADS_DIR;
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            const dest = path.join(destDir, filename);
            fs.writeFileSync(dest, gedcomText, 'utf8');
            gedcomPath = isPublic ? `/uploads/trees/${filename}` : `private/trees/${filename}`;
        }

        if (file && !isPublic) {
            const src = file.path;
            const dest = path.join(PRIVATE_TREE_UPLOADS_DIR, file.filename);
            safeMoveFile(src, dest);
            gedcomPath = `private/trees/${file.filename}`;
        }
        const newTree = await Tree.query(this.knex).insertAndFetch({
            title,
            description: data.description,
            archive_source: data.archiveSource,
            document_code: data.documentCode,
            gedcom_path: gedcomPath,
            gedcom_text: gedcomText,
            data_format: dataFormat,
            user_id: userId,
            is_public: isPublic,
        });

        this.clearCache();
        if (gedcomText) {
            this.gedcomCache.set(Number(newTree.id), { text: gedcomText, expiry: Date.now() + 60000 });
        }

        if (gedcomPath) {
            this.rebuildPeople(newTree.id, gedcomPath).catch((e: any) =>
                console.warn(`rebuildPeople async note for tree #${newTree.id}:`, e?.message || e)
            );
        }

        this.activityService.log(userId, 'trees', `Created tree: ${title}`).catch(() => {});
        return newTree;
    }

    async update(id: number, data: any, userId: number, userRole: number, file?: Express.Multer.File) {
        const tree = await this.findOne(id);

        const roleId = Number(userRole ?? 0);
        const isAdmin = roleId === 1 || roleId === 3;
        const isOwner = tree.user_id === userId;
        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Forbidden');
        }

        const updateData: any = {};
        const title = data.title ?? data.name;
        if (title) updateData.title = title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.archiveSource !== undefined) updateData.archive_source = data.archiveSource;
        if (data.documentCode !== undefined) updateData.document_code = data.documentCode;

        const isPublic = data.isPublic !== undefined
            ? (data.isPublic === 'true' || data.isPublic === true || data.isPublic === 1)
            : !!tree.is_public;
        updateData.is_public = Boolean(isPublic);

        let gedcomPath = tree.gedcom_path;

        if (file) {
            const gedcomText = fs.readFileSync(file.path, 'utf8');
            if (tree.gedcom_path) safeUnlink(resolveStoredFilePath(tree.gedcom_path));

            let newPath = `/uploads/trees/${file.filename}`;
            if (!isPublic) {
                const dest = path.join(PRIVATE_TREE_UPLOADS_DIR, file.filename);
                safeMoveFile(file.path, dest);
                newPath = `private/trees/${file.filename}`;
            }
            updateData.gedcom_path = newPath;
            updateData.gedcom_text = gedcomText;
            const explicit = data.data_format ?? data.dataFormat;
            if (explicit === 'gedcom7' || explicit === 'gedcomx' || explicit === 'gedcom') {
                updateData.data_format = explicit;
            } else {
                updateData.data_format = this.inferDataFormat(file.originalname, gedcomText.slice(0, 4000));
            }
            gedcomPath = newPath;
            this.gedcomCache.set(Number(id), { text: gedcomText, expiry: Date.now() + 60000 });
        } else if (data.gedcom_text !== undefined || data.gedcomText !== undefined) {
            const rawText = data.gedcom_text ?? data.gedcomText ?? '';
            if (typeof rawText === 'string' && rawText.trim().length > 0) {
                updateData.gedcom_text = rawText;
                const explicit = data.data_format ?? data.dataFormat;
                if (explicit === 'gedcom7' || explicit === 'gedcomx' || explicit === 'gedcom') {
                    updateData.data_format = explicit;
                } else {
                    updateData.data_format = this.inferDataFormat('tree.ged', rawText.slice(0, 4000));
                }
                const filename = `tree_${id}_${Date.now()}.ged`;
                const destDir = isPublic ? TREE_UPLOADS_DIR : PRIVATE_TREE_UPLOADS_DIR;
                if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
                const dest = path.join(destDir, filename);
                fs.writeFileSync(dest, rawText, 'utf8');
                updateData.gedcom_path = isPublic ? `/uploads/trees/${filename}` : `private/trees/${filename}`;
                gedcomPath = updateData.gedcom_path;
                this.gedcomCache.set(Number(id), { text: rawText, expiry: Date.now() + 60000 });
            }
        } else if (tree.is_public !== isPublic && tree.gedcom_path) {
            const currentPath = resolveStoredFilePath(tree.gedcom_path);
            if (currentPath && fs.existsSync(currentPath)) {
                const filename = path.basename(currentPath);
                if (isPublic) {
                    const dest = path.join(TREE_UPLOADS_DIR, filename);
                    safeMoveFile(currentPath, dest);
                    updateData.gedcom_path = `/uploads/trees/${filename}`;
                } else {
                    const dest = path.join(PRIVATE_TREE_UPLOADS_DIR, filename);
                    safeMoveFile(currentPath, dest);
                    updateData.gedcom_path = `private/trees/${filename}`;
                }
                gedcomPath = updateData.gedcom_path;
            }
        }

        await Tree.query(this.knex).patch(updateData).where('id', id);
        this.clearCache();

        if (file || (gedcomPath && tree.is_public !== isPublic)) {
            if (file && gedcomPath) {
                this.rebuildPeople(id, gedcomPath).catch((e: any) =>
                    console.warn(`rebuildPeople async note for tree #${id}:`, e?.message || e)
                );
            }
        }

        this.activityService.log(userId, 'trees', `Updated tree: ${tree.title}`).catch(() => {});
        return { id };
    }

    async delete(id: number, userId: number, userRole: number) {
        const roleId = Number(userRole ?? 0);
        const isAdmin = roleId === 1 || roleId === 3;

        const tree = await this.knex('family_trees').where({ id }).select('id', 'user_id', 'title', 'gedcom_path').first();
        if (!tree) throw new NotFoundException('Tree not found');

        const isOwner = Number(tree.user_id) === Number(userId);
        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Forbidden');
        }

        // Parallel direct fast SQL deletion
        await Promise.all([
            this.knex('persons').where('tree_id', id).del().catch(() => {}),
            this.knex('family_trees').where('id', id).del()
        ]);
        this.clearCache();

        if (tree.gedcom_path) safeUnlink(resolveStoredFilePath(tree.gedcom_path));
        this.activityService.log(userId, 'trees', `Deleted tree: ${tree.title}`).catch(() => {});
        return { message: 'Deleted', backupCreated: true };
    }

    // ===== Tree backups (redesign parity) =====
    private backupsReady = false;
    private async ensureBackupsSchema() {
        if (this.backupsReady) return;
        if (!(await this.knex.schema.hasTable('tree_backup_snapshots'))) {
            await this.knex.schema.createTable('tree_backup_snapshots', (table: any) => {
                table.increments('id').primary();
                table.integer('tree_id').unsigned().notNullable();
                table.integer('actor_id').unsigned().nullable();
                table.string('reason').nullable();
                table.text('payload_json', 'longtext').notNullable();
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.timestamp('restored_at').nullable();
                table.integer('restored_by').unsigned().nullable();
            });
        }
        this.backupsReady = true;
    }

    async createBackup(treeId: number, actorId: number, reason: string) {
        await this.ensureBackupsSchema();
        const tree = await this.knex('family_trees').where({ id: treeId }).first();
        if (!tree) throw new NotFoundException('Tree not found');
        const people = await this.knex('persons').where({ tree_id: treeId });
        const [id] = await this.knex('tree_backup_snapshots').insert({
            tree_id: treeId,
            actor_id: actorId,
            reason,
            payload_json: JSON.stringify({ tree, people }),
        });
        return this.knex('tree_backup_snapshots').where({ id }).first();
    }

    async listBackups() {
        await this.ensureBackupsSchema();
        return this.knex('tree_backup_snapshots')
            .select('id', 'tree_id', 'actor_id', 'reason', 'created_at', 'restored_at', 'restored_by')
            .orderBy('created_at', 'desc');
    }

    async restoreBackup(snapshotId: number, actorId: number) {
        await this.ensureBackupsSchema();
        const snapshot = await this.knex('tree_backup_snapshots').where({ id: snapshotId }).first();
        if (!snapshot) throw new NotFoundException('Backup not found');
        if (snapshot.restored_at) return { treeId: snapshot.tree_id, alreadyRestored: true };
        const payload = JSON.parse(snapshot.payload_json || '{}');
        const treeId = await this.knex.transaction(async (trx: any) => {
            const tree = { ...payload.tree };
            delete tree.id;
            delete tree.created_at;
            delete tree.updated_at;
            const [restoredId] = await trx('family_trees').insert(tree);
            const people = Array.isArray(payload.people)
                ? payload.people.map((person: any) => ({ ...person, id: undefined, tree_id: restoredId }))
                : [];
            if (people.length) await trx('persons').insert(people);
            await trx('tree_backup_snapshots')
                .where({ id: snapshotId })
                .update({
                    restored_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    restored_by: actorId,
                });
            return restoredId;
        });
        await this.activityService.log(actorId, 'trees', `Restored backup #${snapshotId} as tree #${treeId}`);
        return { treeId, alreadyRestored: false };
    }

    getGedcomPath(tree: Tree) {
        return resolveStoredFilePath(tree.gedcom_path);
    }

    /** Infer data_format from file extension and optional content. .ged with VERS 7.0 -> gedcom7. */
    private inferDataFormat(filename?: string, content?: string): 'gedcom' | 'gedcomx' | 'gedcom7' {
        const ext = (filename || '').toLowerCase().split('.').pop() || '';
        if (ext === 'json' || ext === 'xml' || ext === 'gedx') return 'gedcomx';
        if ((ext === 'ged' || ext === 'gedcom') && content && /VERS\s+7\.0/i.test(content)) return 'gedcom7';
        return 'gedcom';
    }

    // GEDCOM Parsing Logic
    private normalizeGedcomName(raw: string) {
        const cleaned = String(raw || '').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
        return cleaned || null;
    }

    private parseGedcomPeople(text: string) {
        const lines = String(text || '').split(/\r\n|\n|\r/);
        const people: any[] = [];
        let current: any = null;
        let lastEventTag = '';

        const flush = () => {
            if (!current) return;
            let given = this.normalizeGedcomName(current.given) || '';
            let surname = this.normalizeGedcomName(current.surname) || '';
            let name = current.name || [given, surname].filter(Boolean).join(' ').trim() || null;
            if (name) {
                if (!given || !surname) {
                    const parts = name.split(' ');
                    if (parts.length > 1) {
                        given = given || parts[0];
                        surname = surname || parts.slice(1).join(' ');
                    } else {
                        given = given || name;
                    }
                }
                people.push({
                    gedcomId: current.gedcomId || null,
                    name,
                    given,
                    surname,
                    gender: current.gender || '',
                    birthDate: current.birthDate || '',
                    birthYear: current.birthDate || current.birthYear || '',
                    birthPlace: current.birthPlace || '',
                    deathDate: current.deathDate || '',
                    deathPlace: current.deathPlace || '',
                    profession: current.profession || '',
                    details: current.notes ? current.notes.join('\n') : '',
                });
            }
            current = null;
        };

        for (const rawLine of lines) {
            const line = String(rawLine || '').trim();
            if (!line) continue;
            const parts = line.split(/\s+/);

            if (parts[0] === '0') {
                if (/^0\s+@[^@]+@\s+INDI\b/i.test(line) || /^0\s+INDI\b/i.test(line)) {
                    flush();
                    const idMatch = line.match(/^0\s+(@[^@]+@)\s+INDI/i);
                    current = { gedcomId: idMatch ? idMatch[1] : '', name: null, given: '', surname: '', gender: '', birthYear: '', birthDate: '', birthPlace: '', deathDate: '', deathPlace: '', profession: '', notes: [] };
                    lastEventTag = '';
                } else {
                    flush();
                    current = null;
                    lastEventTag = '';
                }
                continue;
            }

            if (!current) continue;

            const tag = String(parts[1] || '').toUpperCase();
            const value = parts.slice(2).join(' ').trim();

            if (tag === 'BIRT' || tag === 'DEAT') {
                lastEventTag = tag;
                continue;
            }

            if (tag === 'NAME') {
                current.name = this.normalizeGedcomName(value);
                const slashMatch = value.match(/([^/]+)?\s*\/([^/]+)\//);
                if (slashMatch) {
                    if (slashMatch[1]) current.given = slashMatch[1].trim();
                    if (slashMatch[2]) current.surname = slashMatch[2].trim();
                }
            }
            if (tag === 'GIVN') current.given = value;
            if (tag === 'SURN') current.surname = value;
            if (tag === 'SEX') current.gender = value;
            if (tag === 'OCCU') current.profession = value;
            if (tag === 'NOTE') current.notes.push(value);
            if (tag === 'CONT' && current.notes.length) current.notes[current.notes.length - 1] += ' ' + value;

            if (tag === 'DATE') {
                if (lastEventTag === 'BIRT') current.birthDate = value;
                else if (lastEventTag === 'DEAT') current.deathDate = value;
            }
            if (tag === 'PLAC') {
                if (lastEventTag === 'BIRT') current.birthPlace = value;
                else if (lastEventTag === 'DEAT') current.deathPlace = value;
            }
        }
        flush();
        return people;
    }

    async rebuildPeople(treeId: number, gedcomPath: string) {
        if (!treeId) return;
        try {
            const filePath = resolveStoredFilePath(gedcomPath);
            let content: string;
            let sourceName: string;
            if (filePath && fs.existsSync(filePath)) {
                content = fs.readFileSync(filePath, 'utf8');
                sourceName = path.basename(filePath);
            } else {
                const stored = await Tree.query(this.knex).findById(treeId).select('gedcom_text');
                content = typeof (stored as any)?.gedcom_text === 'string' ? (stored as any).gedcom_text : '';
                sourceName = gedcomPath ? path.basename(gedcomPath) : 'tree.ged';
                if (!content.trim()) {
                    await Person.query(this.knex).delete().where('tree_id', treeId);
                    await this.knex('individuals').delete().where('tree_id', treeId);
                    return;
                }
            }

            const format = detectGedcomXFormat(content, sourceName);
            let people: any[] = [];

            if (format === 'json') {
                try {
                    const data = JSON.parse(content);
                    const parsed = parseGedcomXFromJson(data);
                    people = parsed.map((p) => ({
                        name: (p.names && (p.names as any).en) || [p.given, p.surname].filter(Boolean).join(' ') || 'Unknown',
                        given: p.given || '',
                        surname: p.surname || '',
                        gender: p.gender || '',
                    }));
                } catch (e) {
                    console.warn('GEDCOM X JSON parse failed:', (e as Error)?.message);
                    return;
                }
            } else if (format === 'xml') {
                try {
                    const parsed = parseGedcomXFromXml(content);
                    people = parsed.map((p) => ({
                        name: (p.names && (p.names as any).en) || [p.given, p.surname].filter(Boolean).join(' ') || 'Unknown',
                        given: p.given || '',
                        surname: p.surname || '',
                        gender: p.gender || '',
                    }));
                } catch (e) {
                    console.warn('GEDCOM X XML parse failed:', (e as Error)?.message);
                    return;
                }
            } else {
                try {
                    people = this.parseGedcomPeople(content) || [];
                } catch (parseErr) {
                    console.warn('GEDCOM parse failed, keeping existing people:', (parseErr as Error)?.message);
                    return;
                }
            }

            const tree = await Tree.query(this.knex).findById(treeId).select('user_id', 'is_public');
            const userId = (tree as any)?.user_id || null;
            const isPublic = (tree as any)?.is_public !== undefined ? Boolean((tree as any).is_public) : true;

            await this.knex.transaction(async (trx: any) => {
                await trx('persons').where('tree_id', treeId).delete();
                await trx('individuals').where('tree_id', treeId).delete();
                if (!people.length) return;

                const chunkSize = 500;
                for (let i = 0; i < people.length; i += chunkSize) {
                    const chunk = people.slice(i, i + chunkSize);

                    const personsInsert = chunk.map(p => ({
                        tree_id: treeId,
                        name: p.name
                    }));
                    await trx('persons').insert(personsInsert);

                    const individualsInsert = chunk.map(p => ({
                        user_id: userId,
                        tree_id: treeId,
                        gedcom_id: p.gedcomId || null,
                        name: p.name,
                        given: p.given || '',
                        surname: p.surname || '',
                        first_name: p.given || '',
                        last_name: p.surname || '',
                        gender: p.gender || '',
                        birth_year: p.birthYear || p.birthDate || '',
                        birth_date: p.birthDate || '',
                        birth_place: p.birthPlace || '',
                        death_date: p.deathDate || '',
                        death_place: p.deathPlace || '',
                        profession: p.profession || '',
                        details: p.details || '',
                        is_backed_up: true,
                        is_public: isPublic
                    }));
                    await trx('individuals').insert(individualsInsert);
                }
            });
        } catch (err) {
            console.error('Failed to rebuild tree people', (err as Error)?.message);
        }
    }
}
