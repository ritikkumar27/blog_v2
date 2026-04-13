import { Controller, Get, Post, Body, Param, Render, Res, UseGuards, NotFoundException, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { db } from '../../db';
import { posts, comments } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';
import type { Response } from 'express';

@Controller('admin')
@UseGuards(AuthGuard) 
export class AdminController {

  
  @Get()
  @Render('admin/dashboard')
  async dashboard() {
    const allPosts = await db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
    });

    const pendingComments = await db.query.comments.findMany({
      orderBy: [desc(comments.createdAt)],
    });

    return { posts: allPosts, pendingComments: pendingComments };
  }

  
  @Get('posts/new')
  @Render('admin/editor')
  newPostForm() {
    return { post: null }; 
  }

  
  @Post('posts')
  async createPost(
    @Body() body: any,
    @Res() res: Response,
  ) {
    
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const wordCount = body.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    await db.insert(posts).values({
      slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content,
      coverImage: body.coverImage || null,
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
      published: body.published === 'on',
      readingTime,
    });

    res.redirect('/admin');
  }
// ------------------------------------------------------------------------- 28 march error 1 routes fix
  @Get('posts/:id/edit')
  @Render('admin/editor')
  async editPostForm(@Param('id') id: string) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(id, 10)),
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return { post };
  }

  @Post('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const wordCount = body.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    await db.update(posts)
      .set({
        slug,
        title: body.title,
        excerpt: body.excerpt || '',
        content: body.content,
        coverImage: body.coverImage || null,
        tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
        published: body.published === 'on',
        readingTime,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, parseInt(id, 10)));

    res.redirect('/admin');
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    await db.delete(posts).where(eq(posts.id, parseInt(id, 10)));
    return { success: true };
  }
}
