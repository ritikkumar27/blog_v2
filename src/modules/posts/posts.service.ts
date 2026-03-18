import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { posts } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  
  // 1.latest 3 posts for my portfolio widget
  async getLatestPosts(limit: number = 3) {
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
}
