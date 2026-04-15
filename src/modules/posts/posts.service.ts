import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { posts, comments } from '../../db/schema';
import { desc, eq, sql } from 'drizzle-orm';

@Injectable()
export class PostsService {
  
  // 1.latest 6 posts for my portfolio widget
  async getLatestPosts(limit: number = 6) {
    return db.query.posts.findMany({
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
      limit: limit,
      columns: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        readingTime: true,
        createdAt: true,
        likes: true,
        views: true,
      },
      extras: {
        commentCount: sql<number>`(select count(*) from comments where comments.post_id = posts.id)::int`.as('commentCount')
      }
    });
  }

  // 2.a single post by slug
  async getPostBySlug(slug: string) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    
    return post;
  }

  
  async incrementViews(id: number) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      columns: { views: true }
    });

    if (post) {
      await db.update(posts)
        .set({ views: post.views + 1 })
        .where(eq(posts.id, id));
    }
  }

  async incrementLikes(id: number) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      columns: { likes: true }
    });

    if (post) {
      await db.update(posts)
        .set({ likes: post.likes + 1 })
        .where(eq(posts.id, id));
    }
  }
}
