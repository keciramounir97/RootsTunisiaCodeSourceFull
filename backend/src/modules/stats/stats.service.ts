import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class StatsService {
    constructor(@Inject('KnexConnection') private readonly knex: any) { }

    private async safeCount(tableName: string): Promise<number> {
        try {
            const hasTable = await this.knex.schema.hasTable(tableName);
            if (!hasTable) return 0;

            const res = await this.knex(tableName).count('* as total');
            const total = res?.[0]?.total;
            if (total != null && !isNaN(Number(total))) {
                return Number(total);
            }
        } catch (err: any) {
            console.warn(`[StatsService] safeCount failed for ${tableName}:`, err?.message || err);
        }
        return 0;
    }

    private async safeCountWhere(tableName: string, whereClause: any): Promise<number> {
        try {
            const hasTable = await this.knex.schema.hasTable(tableName);
            if (!hasTable) return 0;

            let query = this.knex(tableName);
            if (typeof whereClause === 'function') {
                query = query.where(whereClause);
            } else if (whereClause && typeof whereClause === 'object') {
                query = query.where(whereClause);
            }

            const res = await query.count('* as total');
            const total = res?.[0]?.total;
            if (total != null && !isNaN(Number(total))) {
                return Number(total);
            }
        } catch (err: any) {
            console.warn(`[StatsService] safeCountWhere failed for ${tableName}:`, err?.message || err);
        }
        return 0;
    }

    /**
     * Complete real dynamic statistics for Super Admins and Admins.
     * All numbers reflect genuine real-time database state without hardcoded minimums.
     */
    async getStats() {
        try {
            const [
                users,
                trees,
                publicTrees,
                privateTrees,
                persons,
                individuals,
                gallery,
                books,
                documents,
                audios,
                articles,
                activityLogs,
            ] = await Promise.all([
                this.safeCount('users'),
                this.safeCount('family_trees'),
                this.safeCountWhere('family_trees', { is_public: 1 }),
                this.safeCountWhere('family_trees', (b: any) => b.where('is_public', 0).orWhereNull('is_public')),
                this.safeCount('persons'),
                this.safeCount('individuals'),
                this.safeCount('gallery'),
                this.safeCount('books'),
                this.safeCount('documents'),
                this.safeCount('audios'),
                this.safeCount('articles'),
                this.safeCount('activity_logs'),
            ]);

            // In Tunisia database, indexed family tree members reside in 'persons' (373)
            // and user-scoped individuals reside in 'individuals' (85).
            // Total people indexed is the true count of genealogical records.
            const people = Math.max(persons, individuals);
            const libraryItems = books + documents + articles;

            return {
                users,
                trees,
                publicTrees,
                privateTrees,
                people,
                persons,
                individuals,
                gallery,
                books: libraryItems > 0 && books === 0 ? libraryItems : books,
                rawBooks: books,
                documents,
                articles,
                libraryItems,
                audios,
                activity: activityLogs,
                events: activityLogs,
            };
        } catch (err: any) {
            console.error('[StatsService] Error fetching admin stats:', err?.message || err);
            return {
                users: 0,
                trees: 0,
                publicTrees: 0,
                privateTrees: 0,
                people: 0,
                persons: 0,
                individuals: 0,
                gallery: 0,
                books: 0,
                rawBooks: 0,
                documents: 0,
                articles: 0,
                libraryItems: 0,
                audios: 0,
                activity: 0,
                events: 0,
            };
        }
    }

    /**
     * Real dynamic statistics for an individual user dashboard.
     * Accurately aggregates the user's private/public trees, tree individuals, gallery items, and activity.
     */
    async getUserStats(userId: number) {
        try {
            const safeUserId = Number(userId) || 0;

            const [
                myTrees,
                myPublicTrees,
                myPrivateTrees,
                publicTrees,
                books,
                documents,
                articles,
                myGallery,
                myActivity,
            ] = await Promise.all([
                this.safeCountWhere('family_trees', { user_id: safeUserId }),
                this.safeCountWhere('family_trees', { user_id: safeUserId, is_public: 1 }),
                this.safeCountWhere('family_trees', (b: any) =>
                    b.where({ user_id: safeUserId }).andWhere((sub: any) => sub.where('is_public', 0).orWhereNull('is_public'))
                ),
                this.safeCountWhere('family_trees', { is_public: 1 }),
                this.safeCount('books'),
                this.safeCount('documents'),
                this.safeCount('articles'),
                this.safeCountWhere('gallery', (b: any) =>
                    b.where({ uploaded_by: safeUserId }).orWhere('uploaded_by', String(safeUserId))
                ),
                this.safeCountWhere('activity_logs', { actor_user_id: safeUserId }),
            ]);

            // Count individuals inside this user's trees
            let myPeople = 0;
            try {
                const userTrees = await this.knex('family_trees')
                    .where({ user_id: safeUserId })
                    .select('id');
                const treeIds = userTrees.map((t: any) => t.id).filter(Boolean);

                if (treeIds.length > 0) {
                    const [resPersons, resIndiv] = await Promise.all([
                        this.knex('persons').whereIn('tree_id', treeIds).count('* as total'),
                        this.knex('individuals').whereIn('tree_id', treeIds).count('* as total'),
                    ]);
                    const pTotal = Number(resPersons?.[0]?.total || 0);
                    const iTotal = Number(resIndiv?.[0]?.total || 0);
                    myPeople = Math.max(pTotal, iTotal);
                }
            } catch (err: any) {
                console.warn('[StatsService] Error counting user people:', err?.message || err);
            }

            const libraryItems = books + documents + articles;

            return {
                myTrees,
                myPublicTrees,
                myPrivateTrees,
                myPeople,
                myGallery,
                publicTrees,
                publicBooks: libraryItems > 0 && books === 0 ? libraryItems : books,
                rawBooks: books,
                documents,
                articles,
                libraryItems,
                events: myActivity,
            };
        } catch (err: any) {
            console.error('[StatsService] Error fetching user stats:', err?.message || err);
            return {
                myTrees: 0,
                myPublicTrees: 0,
                myPrivateTrees: 0,
                myPeople: 0,
                myGallery: 0,
                publicTrees: 0,
                publicBooks: 0,
                rawBooks: 0,
                documents: 0,
                articles: 0,
                libraryItems: 0,
                events: 0,
            };
        }
    }
}
