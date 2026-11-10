import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class SocialService {
    constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

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

    /** Admin list all comments for moderation */
    async listAllComments(page = 1, limit = 50, search?: string) {
        let query = this.knex('social_comments')
            .join('users', 'social_comments.user_id', 'users.id')
            .select(
                'social_comments.id',
                'social_comments.media_key',
                'social_comments.entity_type',
                'social_comments.content',
                'social_comments.is_approved',
                'social_comments.created_at',
                'users.id as user_id',
                'users.full_name as user_name',
                'users.email as user_email'
            );

        if (search) {
            const s = `%${search.trim()}%`;
            query = query.where((b: any) => {
                b.where('social_comments.content', 'like', s)
                 .orWhere('users.full_name', 'like', s)
                 .orWhere('users.email', 'like', s)
                 .orWhere('social_comments.media_key', 'like', s);
            });
        }

        const totalRow: any = await query.clone().count('* as count').first();
        const items = await query.orderBy('social_comments.created_at', 'desc')
            .offset((page - 1) * limit)
            .limit(limit);

        return {
            items,
            total: Number(totalRow?.count || 0),
            page,
            limit,
        };
    }
}
