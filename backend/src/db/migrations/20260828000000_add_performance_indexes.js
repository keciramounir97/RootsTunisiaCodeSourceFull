/**
 * Migration: Performance Indexes for Roots Tunisia Database
 * Accelerates queries on family_trees, individuals, persons, users, gallery, books, audios, documents, refresh_tokens, and password_resets.
 */

exports.up = async function(knex) {
  const addIndexSafely = async (table, columns, indexName) => {
    try {
      const hasTable = await knex.schema.hasTable(table);
      if (!hasTable) return;
      await knex.schema.alterTable(table, (t) => {
        t.index(columns, indexName);
      });
    } catch (err) {
      // Ignore if index already exists
    }
  };

  await addIndexSafely('family_trees', ['user_id', 'is_public'], 'idx_trees_user_public');
  await addIndexSafely('family_trees', ['created_at'], 'idx_trees_created_at');
  
  await addIndexSafely('individuals', ['tree_id'], 'idx_indiv_tree_id');
  await addIndexSafely('individuals', ['user_id', 'is_public'], 'idx_indiv_user_public');
  await addIndexSafely('individuals', ['name'], 'idx_indiv_name');

  await addIndexSafely('persons', ['tree_id'], 'idx_persons_tree_id');

  await addIndexSafely('users', ['email'], 'idx_users_email');
  await addIndexSafely('users', ['role_id', 'status'], 'idx_users_role_status');

  await addIndexSafely('gallery', ['is_public', 'created_at'], 'idx_gallery_public_created');
  await addIndexSafely('gallery', ['uploaded_by'], 'idx_gallery_uploaded_by');

  await addIndexSafely('books', ['is_public', 'created_at'], 'idx_books_public_created');
  await addIndexSafely('books', ['uploaded_by'], 'idx_books_uploaded_by');

  await addIndexSafely('audios', ['is_public', 'created_at'], 'idx_audios_public_created');
  await addIndexSafely('documents', ['is_public', 'created_at'], 'idx_documents_public_created');

  await addIndexSafely('refresh_tokens', ['user_id'], 'idx_refreshtokens_user');
  await addIndexSafely('refresh_tokens', ['token'], 'idx_refreshtokens_token');
};

exports.down = async function(knex) {
  const dropIndexSafely = async (table, indexName) => {
    try {
      const hasTable = await knex.schema.hasTable(table);
      if (!hasTable) return;
      await knex.schema.alterTable(table, (t) => {
        t.dropIndex([], indexName);
      });
    } catch (err) {
      // Ignore
    }
  };

  await dropIndexSafely('family_trees', 'idx_trees_user_public');
  await dropIndexSafely('family_trees', 'idx_trees_created_at');
  await dropIndexSafely('individuals', 'idx_indiv_tree_id');
  await dropIndexSafely('individuals', 'idx_indiv_user_public');
  await dropIndexSafely('individuals', 'idx_indiv_name');
  await dropIndexSafely('persons', 'idx_persons_tree_id');
  await dropIndexSafely('users', 'idx_users_email');
  await dropIndexSafely('users', 'idx_users_role_status');
  await dropIndexSafely('gallery', 'idx_gallery_public_created');
  await dropIndexSafely('gallery', 'idx_gallery_uploaded_by');
  await dropIndexSafely('books', 'idx_books_public_created');
  await dropIndexSafely('books', 'idx_books_uploaded_by');
  await dropIndexSafely('audios', 'idx_audios_public_created');
  await dropIndexSafely('documents', 'idx_documents_public_created');
  await dropIndexSafely('refresh_tokens', 'idx_refreshtokens_user');
  await dropIndexSafely('refresh_tokens', 'idx_refreshtokens_token');
};
