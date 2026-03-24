import { Controller, Get, Post, Body, Param, Render, Res, UseGuards } from '@nestjs/common';
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
      where: eq(comments.approved, false),
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
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
      published: body.published === 'on',
      readingTime,
    });

    res.redirect('/admin');
  }
}
