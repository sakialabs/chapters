"""Create core database models

Revision ID: 001
Revises: 
Create Date: 2025-12-23

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('open_pages', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('last_open_page_grant', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'])
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    
    # Create books table
    op.create_table(
        'books',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('cover_image_url', sa.String(), nullable=True),
        sa.Column('is_private', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_books_id'), 'books', ['id'])
    op.create_index(op.f('ix_books_user_id'), 'books', ['user_id'], unique=True)
    
    # Create chapters table
    op.create_table(
        'chapters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('cover_url', sa.String(), nullable=True),
        sa.Column('mood', sa.String(), nullable=True),
        sa.Column('theme', sa.String(), nullable=True),
        sa.Column('time_period', sa.String(), nullable=True),
        sa.Column('heart_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('edit_window_expires', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chapters_id'), 'chapters', ['id'])
    op.create_index(op.f('ix_chapters_author_id'), 'chapters', ['author_id'])
    op.create_index(op.f('ix_chapters_published_at'), 'chapters', ['published_at'])
    
    # Create chapter_blocks table
    op.create_table(
        'chapter_blocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('block_type', sa.Enum('TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'QUOTE', name='blocktype'), nullable=False),
        sa.Column('content', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chapter_blocks_id'), 'chapter_blocks', ['id'])
    op.create_index(op.f('ix_chapter_blocks_chapter_id'), 'chapter_blocks', ['chapter_id'])
    
    # Create drafts table
    op.create_table(
        'drafts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('mood', sa.String(), nullable=True),
        sa.Column('theme', sa.String(), nullable=True),
        sa.Column('time_period', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_drafts_id'), 'drafts', ['id'])
    op.create_index(op.f('ix_drafts_author_id'), 'drafts', ['author_id'])
    
    # Create draft_blocks table
    op.create_table(
        'draft_blocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('draft_id', sa.Integer(), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('block_type', sa.Enum('TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'QUOTE', name='blocktype'), nullable=False),
        sa.Column('content', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['draft_id'], ['drafts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_draft_blocks_id'), 'draft_blocks', ['id'])
    op.create_index(op.f('ix_draft_blocks_draft_id'), 'draft_blocks', ['draft_id'])
    
    # Create notes table
    op.create_table(
        'notes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('voice_memo_url', sa.String(), nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notes_id'), 'notes', ['id'])
    op.create_index(op.f('ix_notes_author_id'), 'notes', ['author_id'])
    
    # Create footnotes table
    op.create_table(
        'footnotes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('draft_id', sa.Integer(), nullable=True),
        sa.Column('chapter_id', sa.Integer(), nullable=True),
        sa.Column('draft_block_id', sa.Integer(), nullable=True),
        sa.Column('chapter_block_id', sa.Integer(), nullable=True),
        sa.Column('text_range', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['draft_id'], ['drafts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['draft_block_id'], ['draft_blocks.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_block_id'], ['chapter_blocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_footnotes_id'), 'footnotes', ['id'])
    op.create_index(op.f('ix_footnotes_author_id'), 'footnotes', ['author_id'])
    op.create_index(op.f('ix_footnotes_draft_id'), 'footnotes', ['draft_id'])
    op.create_index(op.f('ix_footnotes_chapter_id'), 'footnotes', ['chapter_id'])
    op.create_index(op.f('ix_footnotes_draft_block_id'), 'footnotes', ['draft_block_id'])
    op.create_index(op.f('ix_footnotes_chapter_block_id'), 'footnotes', ['chapter_block_id'])
    
    # Create follows table
    op.create_table(
        'follows',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('follower_id', sa.Integer(), nullable=False),
        sa.Column('followed_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['follower_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['followed_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('follower_id', 'followed_id', name='uq_follow_relationship')
    )
    op.create_index(op.f('ix_follows_id'), 'follows', ['id'])
    op.create_index(op.f('ix_follows_follower_id'), 'follows', ['follower_id'])
    op.create_index(op.f('ix_follows_followed_id'), 'follows', ['followed_id'])
    
    # Create hearts table
    op.create_table(
        'hearts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'chapter_id', name='uq_heart_user_chapter')
    )
    op.create_index(op.f('ix_hearts_id'), 'hearts', ['id'])
    op.create_index(op.f('ix_hearts_user_id'), 'hearts', ['user_id'])
    op.create_index(op.f('ix_hearts_chapter_id'), 'hearts', ['chapter_id'])
    
    # Create bookmarks table
    op.create_table(
        'bookmarks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'chapter_id', name='uq_bookmark_user_chapter')
    )
    op.create_index(op.f('ix_bookmarks_id'), 'bookmarks', ['id'])
    op.create_index(op.f('ix_bookmarks_user_id'), 'bookmarks', ['user_id'])
    op.create_index(op.f('ix_bookmarks_chapter_id'), 'bookmarks', ['chapter_id'])
    op.create_index(op.f('ix_bookmarks_created_at'), 'bookmarks', ['created_at'])
    
    # Create margins table
    op.create_table(
        'margins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('block_id', sa.Integer(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['block_id'], ['chapter_blocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_margins_id'), 'margins', ['id'])
    op.create_index(op.f('ix_margins_chapter_id'), 'margins', ['chapter_id'])
    op.create_index(op.f('ix_margins_author_id'), 'margins', ['author_id'])
    op.create_index(op.f('ix_margins_block_id'), 'margins', ['block_id'])
    
    # Create btl_threads table
    op.create_table(
        'btl_threads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('participant1_id', sa.Integer(), nullable=False),
        sa.Column('participant2_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('OPEN', 'CLOSED', name='btlthreadstatus'), nullable=False, server_default='OPEN'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('closed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['participant1_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['participant2_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_btl_threads_id'), 'btl_threads', ['id'])
    op.create_index(op.f('ix_btl_threads_participant1_id'), 'btl_threads', ['participant1_id'])
    op.create_index(op.f('ix_btl_threads_participant2_id'), 'btl_threads', ['participant2_id'])
    
    # Create btl_invites table
    op.create_table(
        'btl_invites',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('recipient_id', sa.Integer(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('quoted_line', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'ACCEPTED', 'DECLINED', name='btlinvitestatus'), nullable=False, server_default='PENDING'),
        sa.Column('thread_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['thread_id'], ['btl_threads.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_btl_invites_id'), 'btl_invites', ['id'])
    op.create_index(op.f('ix_btl_invites_sender_id'), 'btl_invites', ['sender_id'])
    op.create_index(op.f('ix_btl_invites_recipient_id'), 'btl_invites', ['recipient_id'])
    op.create_index(op.f('ix_btl_invites_status'), 'btl_invites', ['status'])
    
    # Create btl_messages table
    op.create_table(
        'btl_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('thread_id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['thread_id'], ['btl_threads.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_btl_messages_id'), 'btl_messages', ['id'])
    op.create_index(op.f('ix_btl_messages_thread_id'), 'btl_messages', ['thread_id'])
    op.create_index(op.f('ix_btl_messages_sender_id'), 'btl_messages', ['sender_id'])
    
    # Create btl_pins table
    op.create_table(
        'btl_pins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('thread_id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('pinner_id', sa.Integer(), nullable=False),
        sa.Column('excerpt', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['thread_id'], ['btl_threads.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['pinner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_btl_pins_id'), 'btl_pins', ['id'])
    op.create_index(op.f('ix_btl_pins_thread_id'), 'btl_pins', ['thread_id'])
    op.create_index(op.f('ix_btl_pins_chapter_id'), 'btl_pins', ['chapter_id'])
    
    # Create blocks table
    op.create_table(
        'blocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('blocker_id', sa.Integer(), nullable=False),
        sa.Column('blocked_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['blocker_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['blocked_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('blocker_id', 'blocked_id', name='uq_block_relationship')
    )
    op.create_index(op.f('ix_blocks_id'), 'blocks', ['id'])
    op.create_index(op.f('ix_blocks_blocker_id'), 'blocks', ['blocker_id'])
    op.create_index(op.f('ix_blocks_blocked_id'), 'blocks', ['blocked_id'])
    
    # Create reports table
    op.create_table(
        'reports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('reporter_id', sa.Integer(), nullable=False),
        sa.Column('reported_user_id', sa.Integer(), nullable=True),
        sa.Column('reported_chapter_id', sa.Integer(), nullable=True),
        sa.Column('reason', sa.String(), nullable=False),
        sa.Column('details', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED', name='reportstatus'), nullable=False, server_default='PENDING'),
        sa.Column('moderator_notes', sa.Text(), nullable=True),
        sa.Column('resolved_by_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['reporter_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reported_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reported_chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resolved_by_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reports_id'), 'reports', ['id'])
    op.create_index(op.f('ix_reports_reporter_id'), 'reports', ['reporter_id'])
    op.create_index(op.f('ix_reports_reported_user_id'), 'reports', ['reported_user_id'])
    op.create_index(op.f('ix_reports_reported_chapter_id'), 'reports', ['reported_chapter_id'])
    op.create_index(op.f('ix_reports_status'), 'reports', ['status'])
    
    # Create chapter_embeddings table
    op.create_table(
        'chapter_embeddings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('chapter_id', sa.Integer(), nullable=False),
        sa.Column('embedding', Vector(1536), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['chapter_id'], ['chapters.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('chapter_id')
    )
    op.create_index(op.f('ix_chapter_embeddings_id'), 'chapter_embeddings', ['id'])
    op.create_index(op.f('ix_chapter_embeddings_chapter_id'), 'chapter_embeddings', ['chapter_id'], unique=True)
    
    # Create HNSW index for vector similarity search on chapter embeddings
    op.execute('CREATE INDEX ix_chapter_embeddings_embedding_hnsw ON chapter_embeddings USING hnsw (embedding vector_cosine_ops)')
    
    # Create user_taste_profiles table
    op.create_table(
        'user_taste_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('embedding', Vector(1536), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_user_taste_profiles_id'), 'user_taste_profiles', ['id'])
    op.create_index(op.f('ix_user_taste_profiles_user_id'), 'user_taste_profiles', ['user_id'], unique=True)
    
    # Create HNSW index for vector similarity search on user taste profiles
    op.execute('CREATE INDEX ix_user_taste_profiles_embedding_hnsw ON user_taste_profiles USING hnsw (embedding vector_cosine_ops)')


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index('ix_user_taste_profiles_embedding_hnsw', table_name='user_taste_profiles')
    op.drop_table('user_taste_profiles')
    
    op.drop_index('ix_chapter_embeddings_embedding_hnsw', table_name='chapter_embeddings')
    op.drop_table('chapter_embeddings')
    
    op.drop_table('reports')
    op.drop_table('blocks')
    op.drop_table('btl_pins')
    op.drop_table('btl_messages')
    op.drop_table('btl_invites')
    op.drop_table('btl_threads')
    op.drop_table('margins')
    op.drop_table('bookmarks')
    op.drop_table('hearts')
    op.drop_table('follows')
    op.drop_table('footnotes')
    op.drop_table('notes')
    op.drop_table('draft_blocks')
    op.drop_table('drafts')
    op.drop_table('chapter_blocks')
    op.drop_table('chapters')
    op.drop_table('books')
    op.drop_table('users')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS reportstatus')
    op.execute('DROP TYPE IF EXISTS btlinvitestatus')
    op.execute('DROP TYPE IF EXISTS btlthreadstatus')
    op.execute('DROP TYPE IF EXISTS blocktype')
