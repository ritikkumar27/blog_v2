import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { comments } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  
  async createComment(postId: number, authorName: string, body: string) {
    const [newComment] = await db.insert(comments).values({
      postId,
      authorName,
      body,
    }).returning();
    
    return newComment;
  }

  async getApprovedComments(postId: number) {
    return db.query.comments.findMany({
      where: (t) => and(
        eq(t.postId, postId),
        eq(t.approved, true)
      ),
      orderBy: [desc(comments.createdAt)]
    });
  }

  async approveComment(id: number) {
    const [updated] = await db.update(comments)
      .set({ approved: true })
      .where(eq(comments.id, id))
      .returning();
      
    return updated;
  }
}
