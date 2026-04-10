import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../db';
import { comments } from '../../db/schema';
import { eq, desc, isNull, asc } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  
  async createComment(postId: number, authorName: string, body: string, parentId?: number) {
    // Backend Validation
    if (!authorName?.trim() || !body?.trim()) {
      throw new BadRequestException('Name and comment body are required.');
    }

    const values: any = {
      postId,
      authorName: authorName.trim(),
      body: body.trim(),
      approved: true, // Instant publish
    };

    if (parentId) {
      values.parentId = parentId;
    }

    const [newComment] = await db.insert(comments).values(values).returning();
    
    return newComment;
  }

  async getCommentsForPost(postId: number) {
    // Fetch all comments for this post (flat list)
    const allComments = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      orderBy: [asc(comments.createdAt)]
    });

    // Build the tree: top-level comments (no parentId) with nested replies
    const commentMap = new Map<number, any>();
    const topLevel: any[] = [];

    // First pass: index all comments
    for (const c of allComments) {
      commentMap.set(c.id, { ...c, replies: [] });
    }

    // Second pass: attach replies to their parents
    for (const c of allComments) {
      const node = commentMap.get(c.id);
      if (c.parentId && commentMap.has(c.parentId)) {
        commentMap.get(c.parentId).replies.push(node);
      } else {
        topLevel.push(node);
      }
    }

    // Reverse top-level so newest are first, but replies stay chronological
    topLevel.reverse();

    return topLevel;
  }

  async deleteComment(id: number) {
    // Delete the comment and all its replies (cascade via parentId check)
    // First delete child replies, then the parent
    const replies = await db.query.comments.findMany({
      where: eq(comments.parentId, id),
    });
    for (const reply of replies) {
      await this.deleteComment(reply.id); // Recursive delete
    }
    await db.delete(comments).where(eq(comments.id, id));
    return { success: true };
  }
}
