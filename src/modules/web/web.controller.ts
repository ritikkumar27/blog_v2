import { Controller, Get, Param, Render } from '@nestjs/common';
import { db } from '../../db';
import { posts } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';

@Controller() 
export class WebController {

  @Get()
  @Render('index') 
  async getHome() {
    const allPosts = await db.query.posts.findMany({
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
    });

    return { posts: allPosts };
  }

  @Get('p/:slug')
  @Render('post') 
  async getPost(@Param('slug') slug: string) {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    return { post };
  }
}
