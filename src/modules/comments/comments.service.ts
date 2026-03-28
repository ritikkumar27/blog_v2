import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../db';
import { comments } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  
  async createComment(postId: number, authorName: string, body: string) {
    // 1. Backend Validation
    if (!authorName?.trim() || !body?.trim()) {
      throw new BadRequestException('Name and comment body are required.');
    }

    const [newComment] = await db.insert(comments).values({
      postId,
      authorName: authorName.trim(),
      body: body.trim(),
      approved: true, // Instant publish
    }).returning();
    
    return newComment;
  }

  async getCommentsForPost(postId: number) {
    return db.query.comments.findMany({
      where: eq(comments.postId, postId),
      orderBy: [desc(comments.createdAt)] // Newest first
    });
  }

  async deleteComment(id: number) {
    await db.delete(comments).where(eq(comments.id, id));
    return { success: true };
  }
}
