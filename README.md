# Minimalist Editorial Blog

A backend-heavy, minimalist, and editorial-style blogging platform built with **NestJS**.

Will be deploying at: [blog.ritikkumar.dev](https://blog.ritikkumar.dev)

## 📌 Features

- **Backend-Driven Architecture:** REST APIs powered by NestJS and Node.js.
- **Server-Side Rendering:** Uses Handlebars (`hbs`) for fast, server-rendered views.
- **Database Architecture:** PostgreSQL database managed using Drizzle ORM, connected via Supabase.
- **Markdown Support:** Writes and renders posts using raw Markdown, parsed securely in the template engine with `marked`.
- **Admin Dashboard:** Secure dashboard for post and comment management, protected by JWT authentication and HTTP-only cookies.
- **Portfolio API:** Exposes endpoints to fetch the latest blog posts for seamless integration with a main portfolio website.
- **Minimalist Design:** A clean, typography-focused, and manga-inspired interface free of heavy animations, designed for a calming and reflective reading experience.
- **CI/CD Pipeline:** Automated deployment to AWS using GitHub Actions.

## 🛠️ Technology Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Templating:** [Handlebars (hbs)](https://handlebarsjs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
- **Testing:** Jest (`@nestjs/testing`)
- **Deployment:** AWS, GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database
- Basic environment variables configured

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd blog_v2
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory (refer to any `.env.example` if available) and add the following:

   ```env
   DATABASE_URL=postgres://user:password@host:port/database
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3000
   ```

4. **Run database migrations:**
   ```bash
   npx drizzle-kit push:pg
   ```

### Running the Application

```bash
# development
npm run start

# watch mode (recommended for dev)
npm run start:dev

# production mode
npm run start:prod
```

Once running, navigate to `http://localhost:3000` to view the blog.

## 📁 Project Structure

A quick glance at how the codebase is organized:

- `src/main.ts` - Entry point and application bootstrap logic.
- `src/db/` - Drizzle ORM schema definitions and configurations.
- `src/modules/` - Distinct feature modules:
  - `admin/` - Secure routes for post and comment management.
  - `auth/` - Authentication logic using JWTs and cookies.
  - `comments/` - Commenting engine.
  - `posts/` - Blog post rendering and API logic.
  - `web/` - General frontend web controllers.
- `views/` - Handlebars (.hbs) templates for Server-Side Rendering.
- `public/` - Static assets (CSS, images, fonts).
