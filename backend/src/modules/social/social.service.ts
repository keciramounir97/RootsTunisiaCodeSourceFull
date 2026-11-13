import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class SocialService implements OnModuleInit {
    private readonly logger = new Logger(SocialService.name);

    constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

    async onModuleInit() {
        try {
            await this.ensureSocialSchema();
        } catch (err: any) {
            this.logger.warn(`Social schema init skipped: ${err?.message || err}`);
        }
    }

    private async ensureSocialSchema() {
        const hasComments = await this.knex.schema.hasTable('social_comments');
        if (!hasComments) {
            await this.knex.schema.createTable('social_comments', (table) => {
                table.increments('id').primary();
                table.string('media_key', 255).notNullable().index();
                table.integer('user_id').unsigned().notNullable().index();
                table.string('user_name', 255).defaultTo('Member');
                table.text('content').notNullable();
                table.string('entity_type', 100).defaultTo('tree');
                table.integer('entity_id').unsigned().nullable();
                table.boolean('is_approved').defaultTo(true).index();
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.timestamp('updated_at').defaultTo(this.knex.fn.now());
            });
        }

        const hasLikes = await this.knex.schema.hasTable('social_likes');
        if (!hasLikes) {
            await this.knex.schema.createTable('social_likes', (table) => {
                table.increments('id').primary();
                table.string('media_key', 255).notNullable().index();
                table.integer('user_id').unsigned().notNullable().index();
                table.string('entity_type', 100).defaultTo('tree');
                table.integer('entity_id').unsigned().nullable();
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.unique(['media_key', 'user_id']);
            });
        }
    }

    private async resolveItemTitles(items: any[]) {
        if (!items || items.length === 0) return items;

        const treeIds = new Set<number>();
        const galleryIds = new Set<number>();
        const articleIds = new Set<number>();
        const bookIds = new Set<number>();
        const docIds = new Set<number>();
        const audioIds = new Set<number>();

        for (const it of items) {
            const key = String(it.media_key || it.mediaKey || '');
            const type = String(it.entity_type || it.entityType || '').toLowerCase();
            const id = Number(it.entity_id || it.entityId);

            if (type === 'tree' || key.startsWith('gallery_tree_') || key.startsWith('tree_')) {
                const parsedId = id || Number(key.replace(/^gallery_tree_|^tree_/, ''));
                if (parsedId && !isNaN(parsedId)) treeIds.add(parsedId);
            } else if (type === 'gallery' || key.startsWith('gallery_img_') || key.startsWith('img_')) {
                const parsedId = id || Number(key.replace(/^gallery_img_|^img_/, ''));
                if (parsedId && !isNaN(parsedId)) galleryIds.add(parsedId);
            } else if (type === 'article' || key.startsWith('gallery_article_') || key.startsWith('article_')) {
                const parsedId = id || Number(key.replace(/^gallery_article_|^article_/, ''));
                if (parsedId && !isNaN(parsedId)) articleIds.add(parsedId);
            } else if (type === 'book' || key.startsWith('gallery_book_') || key.startsWith('book_')) {
                const parsedId = id || Number(key.replace(/^gallery_book_|^book_/, ''));
                if (parsedId && !isNaN(parsedId)) bookIds.add(parsedId);
            } else if (type === 'document' || key.startsWith('gallery_doc_') || key.startsWith('doc_')) {
                const parsedId = id || Number(key.replace(/^gallery_doc_|^doc_/, ''));
                if (parsedId && !isNaN(parsedId)) docIds.add(parsedId);
            } else if (type === 'audio' || key.startsWith('gallery_audio_') || key.startsWith('audio_')) {
                const parsedId = id || Number(key.replace(/^gallery_audio_|^audio_/, ''));
                if (parsedId && !isNaN(parsedId)) audioIds.add(parsedId);
            }
        }

        const [treesList, galleryList, articlesList, booksList, docsList, audiosList] = await Promise.all([
            treeIds.size > 0 ? this.knex('family_trees').whereIn('id', Array.from(treeIds)).select('id', 'title') : [],
            galleryIds.size > 0 ? this.knex('gallery').whereIn('id', Array.from(galleryIds)).select('id', 'title') : [],
            articleIds.size > 0 ? this.knex('articles').whereIn('id', Array.from(articleIds)).select('id', 'title') : [],
            bookIds.size > 0 ? this.knex('books').whereIn('id', Array.from(bookIds)).select('id', 'title') : [],
            docIds.size > 0 ? this.knex('documents').whereIn('id', Array.from(docIds)).select('id', 'title') : [],
            audioIds.size > 0 ? this.knex('audios').whereIn('id', Array.from(audioIds)).select('id', 'title') : [],
        ]);

        const titlesById: Record<string, string> = {};
        (treesList as any[]).forEach((t: any) => { titlesById[`tree_${t.id}`] = t.title; });
        (galleryList as any[]).forEach((g: any) => { titlesById[`gallery_${g.id}`] = g.title; });
        (articlesList as any[]).forEach((a: any) => { titlesById[`article_${a.id}`] = a.title; });
        (booksList as any[]).forEach((b: any) => { titlesById[`book_${b.id}`] = b.title; });
        (docsList as any[]).forEach((d: any) => { titlesById[`document_${d.id}`] = d.title; });
        (audiosList as any[]).forEach((au: any) => { titlesById[`audio_${au.id}`] = au.title; });

        return items.map((it) => {
            const key = String(it.media_key || it.mediaKey || '');
            const type = String(it.entity_type || it.entityType || '').toLowerCase();
            const id = Number(it.entity_id || it.entityId);

            let title = '';
            if (type === 'tree' || key.startsWith('gallery_tree_') || key.startsWith('tree_')) {
                const parsedId = id || Number(key.replace(/^gallery_tree_|^tree_/, ''));
                title = titlesById[`tree_${parsedId}`] || '';
            } else if (type === 'gallery' || key.startsWith('gallery_img_') || key.startsWith('img_')) {
                const parsedId = id || Number(key.replace(/^gallery_img_|^img_/, ''));
                title = titlesById[`gallery_${parsedId}`] || '';
            } else if (type === 'article' || key.startsWith('gallery_article_') || key.startsWith('article_')) {
                const parsedId = id || Number(key.replace(/^gallery_article_|^article_/, ''));
                title = titlesById[`article_${parsedId}`] || '';
            } else if (type === 'book' || key.startsWith('gallery_book_') || key.startsWith('book_')) {
                const parsedId = id || Number(key.replace(/^gallery_book_|^book_/, ''));
                title = titlesById[`book_${parsedId}`] || '';
            } else if (type === 'document' || key.startsWith('gallery_doc_') || key.startsWith('doc_')) {
                const parsedId = id || Number(key.replace(/^gallery_doc_|^doc_/, ''));
                title = titlesById[`document_${parsedId}`] || '';
            } else if (type === 'audio' || key.startsWith('gallery_audio_') || key.startsWith('audio_')) {
                const parsedId = id || Number(key.replace(/^gallery_audio_|^audio_/, ''));
                title = titlesById[`audio_${parsedId}`] || '';
            }

            return {
                ...it,
                item_title: title || it.item_title || key,
            };
        });
    }

    /** Get likes count and comments count for a single media item, plus isLiked for current user */
    async getInteractions(mediaKey: string, userId?: number) {
        if (!mediaKey) return { likesCount: 0, isLiked: false, commentsCount: 0, comments: [] };

        const likesRow: any = await this.knex('social_likes')
            .where('media_key', mediaKey)
            .count('* as count')
            .first();

        const likesCount = Number(likesRow?.count || 0);

        let isLiked = false;
        if (userId) {
            const userLike = await this.knex('social_likes')
                .where({ media_key: mediaKey, user_id: userId })
                .first();
            isLiked = !!userLike;
        }

        const comments = await this.knex('social_comments')
            .where({ media_key: mediaKey, is_approved: true })
            .select('id', 'media_key', 'user_id', 'user_name', 'content', 'created_at')
            .orderBy('created_at', 'desc');

        return {
            mediaKey,
            likesCount,
            isLiked,
            commentsCount: comments.length,
            comments: comments.map((c: any) => ({
                id: c.id,
                mediaKey: c.media_key,
                userId: c.user_id,
                userName: c.user_name,
                content: c.content,
                createdAt: c.created_at,
            })),
        };
    }

    /** Batch counts for gallery lists: takes comma-separated media keys and returns map of likes & comments */
    async getBatchCounts(keys: string[], userId?: number) {
        if (!Array.isArray(keys) || keys.length === 0) return {};

        const uniqueKeys = Array.from(new Set(keys.filter(Boolean)));
        if (uniqueKeys.length === 0) return {};

        // Aggregate likes
        const likeRows: any[] = await this.knex('social_likes')
            .whereIn('media_key', uniqueKeys)
            .groupBy('media_key')
            .select('media_key', this.knex.raw('COUNT(*) as likes_count'));

        // Aggregate comments
        const commentRows: any[] = await this.knex('social_comments')
            .whereIn('media_key', uniqueKeys)
            .andWhere('is_approved', true)
            .groupBy('media_key')
            .select('media_key', this.knex.raw('COUNT(*) as comments_count'));

        // Check user likes
        const userLikedSet = new Set<string>();
        if (userId) {
            const userLikes: any[] = await this.knex('social_likes')
                .whereIn('media_key', uniqueKeys)
                .andWhere('user_id', userId)
                .select('media_key');
            userLikes.forEach((r: any) => userLikedSet.add(r.media_key));
        }

        const map: Record<string, { likes: number; comments: number; isLiked: boolean }> = {};
        for (const k of uniqueKeys) {
            map[k] = { likes: 0, comments: 0, isLiked: userLikedSet.has(k) };
        }
        for (const row of likeRows) {
            if (map[row.media_key]) {
                map[row.media_key].likes = Number(row.likes_count || 0);
            }
        }
        for (const row of commentRows) {
            if (map[row.media_key]) {
                map[row.media_key].comments = Number(row.comments_count || 0);
            }
        }
        return map;
    }

    /** Toggle like (requires logged-in user) */
    async toggleLike(mediaKey: string, userId: number, entityType = 'tree', entityId?: number) {
        if (!mediaKey || !userId) throw new BadRequestException('mediaKey and authenticated user are required');

        const existing = await this.knex('social_likes')
            .where({ media_key: mediaKey, user_id: userId })
            .first();

        if (existing) {
            await this.knex('social_likes').where({ id: existing.id }).delete();
        } else {
            await this.knex('social_likes').insert({
                media_key: mediaKey,
                user_id: userId,
                entity_type: entityType || 'tree',
                entity_id: entityId || null,
            });
        }

        const likesCountRow: any = await this.knex('social_likes')
            .where('media_key', mediaKey)
            .count('* as count')
            .first();

        return {
            mediaKey,
            liked: !existing,
            likesCount: Number(likesCountRow?.count || 0),
        };
    }

    /** Add comment (requires logged-in user) */
    async addComment(mediaKey: string, userId: number, userName: string, content: string, entityType = 'tree', entityId?: number) {
        const text = String(content || '').trim();
        if (!text) throw new BadRequestException('Comment content cannot be empty');
        if (!mediaKey || !userId) throw new BadRequestException('mediaKey and authenticated user are required');

        const [newId] = await this.knex('social_comments').insert({
            media_key: mediaKey,
            user_id: userId,
            user_name: userName || 'Member',
            content: text,
            entity_type: entityType || 'tree',
            entity_id: entityId || null,
            is_approved: true,
        });

        const created = await this.knex('social_comments').where({ id: newId }).first();

        const countRow: any = await this.knex('social_comments')
            .where({ media_key: mediaKey, is_approved: true })
            .count('* as count')
            .first();

        return {
            comment: {
                id: created.id,
                mediaKey: created.media_key,
                userId: created.user_id,
                userName: created.user_name,
                content: created.content,
                createdAt: created.created_at,
            },
            commentsCount: Number(countRow?.count || 0),
        };
    }

    /** Delete comment (author or admin) */
    async deleteComment(id: number, userId: number, userRole: number) {
        const comment = await this.knex('social_comments').where({ id }).first();
        if (!comment) throw new NotFoundException('Comment not found');

        const isAdmin = userRole === 1 || userRole === 3;
        const isOwner = Number(comment.user_id) === Number(userId);

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.knex('social_comments').where({ id }).delete();
        return { success: true, message: 'Comment deleted' };
    }

    /** Toggle or set comment approval status (Super Admin / Admin) */
    async setCommentApproval(id: number, isApproved: boolean) {
        const comment = await this.knex('social_comments').where({ id }).first();
        if (!comment) throw new NotFoundException('Comment not found');

        await this.knex('social_comments').where({ id }).update({
            is_approved: isApproved ? 1 : 0,
            updated_at: new Date(),
        });

        const updated = await this.knex('social_comments').where({ id }).first();
        return {
            success: true,
            id: updated.id,
            is_approved: Boolean(updated.is_approved),
        };
    }

    /** Edit comment content & author (Super Admin / Admin) */
    async updateComment(id: number, content?: string, isApproved?: boolean, userName?: string) {
        const comment = await this.knex('social_comments').where({ id }).first();
        if (!comment) throw new NotFoundException('Comment not found');

        const patch: any = {
            updated_at: new Date(),
        };
        if (typeof content === 'string' && content.trim()) {
            patch.content = content.trim();
        }
        if (typeof isApproved === 'boolean') {
            patch.is_approved = isApproved ? 1 : 0;
        }
        if (typeof userName === 'string' && userName.trim()) {
            patch.user_name = userName.trim();
        }

        await this.knex('social_comments').where({ id }).update(patch);
        const updated = await this.knex('social_comments').where({ id }).first();
        return {
            success: true,
            comment: updated,
        };
    }

    /** Delete like by ID (Super Admin / Admin) */
    async deleteLike(id: number) {
        const like = await this.knex('social_likes').where({ id }).first();
        if (!like) throw new NotFoundException('Like not found');

        await this.knex('social_likes').where({ id }).delete();
        return { success: true, message: 'Like removed' };
    }

    /** Admin list all comments for moderation with filters and title resolution */
    async listAllComments(page = 1, limit = 50, search?: string, status?: string, entityType?: string) {
        try {
            await this.ensureSocialSchema();
            let query = this.knex('social_comments')
                .leftJoin('users', 'social_comments.user_id', 'users.id')
                .select(
                    'social_comments.id',
                    'social_comments.media_key',
                    'social_comments.entity_type',
                    'social_comments.entity_id',
                    'social_comments.content',
                    'social_comments.is_approved',
                    'social_comments.created_at',
                    'social_comments.updated_at',
                    this.knex.raw('COALESCE(users.id, social_comments.user_id) as user_id'),
                    this.knex.raw('COALESCE(users.full_name, social_comments.user_name, "Member") as user_name'),
                    'users.email as user_email'
                );

            if (status === 'approved') {
                query = query.where('social_comments.is_approved', 1);
            } else if (status === 'pending') {
                query = query.where((b: any) => b.where('social_comments.is_approved', 0).orWhereNull('social_comments.is_approved'));
            }

            if (entityType && entityType !== 'all') {
                query = query.where((b: any) => {
                    b.where('social_comments.entity_type', entityType)
                     .orWhere('social_comments.media_key', 'like', `%${entityType}%`);
                });
            }

            if (search) {
                const s = `%${search.trim()}%`;
                query = query.where((b: any) => {
                    b.where('social_comments.content', 'like', s)
                     .orWhere('social_comments.user_name', 'like', s)
                     .orWhere('users.full_name', 'like', s)
                     .orWhere('users.email', 'like', s)
                     .orWhere('social_comments.media_key', 'like', s);
                });
            }

            const totalRow: any = await query.clone().clearSelect().count('* as count').first();
            const items = await query.orderBy('social_comments.created_at', 'desc')
                .offset((page - 1) * limit)
                .limit(limit);

            const resolvedItems = await this.resolveItemTitles(items);

            return {
                items: resolvedItems,
                total: Number(totalRow?.count || 0),
                page,
                limit,
            };
        } catch (err: any) {
            this.logger.error(`listAllComments error: ${err?.message || err}`);
            return { items: [], total: 0, page, limit };
        }
    }

    /** Admin list all likes for monitoring with user and title resolution */
    async listAllLikes(page = 1, limit = 50, search?: string, entityType?: string) {
        try {
            await this.ensureSocialSchema();
            let query = this.knex('social_likes')
                .leftJoin('users', 'social_likes.user_id', 'users.id')
                .select(
                    'social_likes.id',
                    'social_likes.media_key',
                    'social_likes.entity_type',
                    'social_likes.entity_id',
                    'social_likes.created_at',
                    'users.id as user_id',
                    this.knex.raw('COALESCE(users.full_name, "Member") as user_name'),
                    'users.email as user_email'
                );

            if (entityType && entityType !== 'all') {
                query = query.where((b: any) => {
                    b.where('social_likes.entity_type', entityType)
                     .orWhere('social_likes.media_key', 'like', `%${entityType}%`);
                });
            }

            if (search) {
                const s = `%${search.trim()}%`;
                query = query.where((b: any) => {
                    b.where('users.full_name', 'like', s)
                     .orWhere('users.email', 'like', s)
                     .orWhere('social_likes.media_key', 'like', s);
                });
            }

            const totalRow: any = await query.clone().clearSelect().count('* as count').first();
            const items = await query.orderBy('social_likes.created_at', 'desc')
                .offset((page - 1) * limit)
                .limit(limit);

            const resolvedItems = await this.resolveItemTitles(items);

            return {
                items: resolvedItems,
                total: Number(totalRow?.count || 0),
                page,
                limit,
            };
        } catch (err: any) {
            this.logger.error(`listAllLikes error: ${err?.message || err}`);
            return { items: [], total: 0, page, limit };
        }
    }

    /** Admin overview metrics and top-liked items */
    async getAdminSocialStats() {
        try {
            await this.ensureSocialSchema();
            const [
                totalCommentsRow,
                approvedCommentsRow,
                pendingCommentsRow,
                totalLikesRow,
                uniqueLikedItemsRow,
                uniqueActiveUsersCommentsRow,
                uniqueActiveUsersLikesRow,
            ] = await Promise.all([
                this.knex('social_comments').count('* as count').first() as any,
                this.knex('social_comments').where('is_approved', 1).count('* as count').first() as any,
                this.knex('social_comments').where((b) => b.where('is_approved', 0).orWhereNull('is_approved')).count('* as count').first() as any,
                this.knex('social_likes').count('* as count').first() as any,
                this.knex('social_likes').countDistinct('media_key as count').first() as any,
                this.knex('social_comments').countDistinct('user_id as count').first() as any,
                this.knex('social_likes').countDistinct('user_id as count').first() as any,
            ]);

            const totalComments = Number(totalCommentsRow?.count || 0);
            const approvedComments = Number(approvedCommentsRow?.count || 0);
            const pendingComments = Number(pendingCommentsRow?.count || 0);
            const totalLikes = Number(totalLikesRow?.count || 0);
            const uniqueLikedItems = Number(uniqueLikedItemsRow?.count || 0);

            // Top 10 most liked items
            const topLikedRaw: any[] = await this.knex('social_likes')
                .groupBy('media_key', 'entity_type', 'entity_id')
                .select(
                    'media_key',
                    'entity_type',
                    'entity_id',
                    this.knex.raw('COUNT(*) as likes_count'),
                    this.knex.raw('MAX(created_at) as last_liked_at')
                )
                .orderBy('likes_count', 'desc')
                .limit(10);

            // Fetch comments count for these top items
            const topKeys = topLikedRaw.map((r) => r.media_key).filter(Boolean);
            const commentsByKeys: Record<string, number> = {};
            if (topKeys.length > 0) {
                const commentRows: any[] = await this.knex('social_comments')
                    .whereIn('media_key', topKeys)
                    .andWhere('is_approved', 1)
                    .groupBy('media_key')
                    .select('media_key', this.knex.raw('COUNT(*) as comments_count'));
                commentRows.forEach((r) => { commentsByKeys[r.media_key] = Number(r.comments_count || 0); });
            }

            const topItemsWithComments = topLikedRaw.map((r) => ({
                media_key: r.media_key,
                entity_type: r.entity_type,
                entity_id: r.entity_id,
                likes_count: Number(r.likes_count || 0),
                comments_count: commentsByKeys[r.media_key] || 0,
                last_liked_at: r.last_liked_at,
            }));

            const resolvedTopItems = await this.resolveItemTitles(topItemsWithComments);

            return {
                totalComments,
                approvedComments,
                pendingComments,
                totalLikes,
                uniqueLikedItems,
                topLikedItems: resolvedTopItems,
            };
        } catch (err: any) {
            this.logger.error(`getAdminSocialStats error: ${err?.message || err}`);
            return {
                totalComments: 0,
                approvedComments: 0,
                pendingComments: 0,
                totalLikes: 0,
                uniqueLikedItems: 0,
                topLikedItems: [],
            };
        }
    }
}
