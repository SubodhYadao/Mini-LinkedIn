# Mini LinkedIn-like Community Platform

This project is a simplified social media platform inspired by LinkedIn, allowing users to register, log in, create text-only posts, and view public feeds and user profiles.

## Stack Used

*   **Frontend Framework**: Next.js 15 (App Router)
*   **Backend**: Next.js Server Actions and Route Handlers
*   **Database & Authentication**: Supabase (PostgreSQL)
*   **Styling**: Tailwind CSS with shadcn/ui components

## Features

*   **User Authentication**: Register and log in with email and password.
*   **User Profiles**: Each user has a profile with a name, email, and bio. Users can edit their own profile.
*   **Public Post Feed**: Create and view text-only posts on a public feed. Posts display the author's name and a timestamp.
*   **Profile Pages**: View individual user profiles and their posts.

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/SubodhYadao/Mini-LinkedIn.git
cd Mini-linkedIn
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Once your project is created, navigate to **Project Settings > API**.
3.  Copy your `Project URL` and `anon public` key.
4.  Create a `.env.local` file in the root of your project and add the following environment variables:
5.  **Run Database Migrations**:


### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin/Demo User Logins

Since this project uses Supabase for authentication, you can register new users directly through the signup page. There are no pre-defined admin or demo user logins.

## Deployment

This application is designed to be easily deployed to Vercel. Ensure your environment variables are configured in your Vercel project settings.

1.  **Connect to Vercel**: If you haven't already, connect your GitHub repository to Vercel.
2.  **Configure Environment Variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your Vercel project's environment variables.
3.  **Deploy**: Vercel will automatically detect the Next.js project and deploy it.

## Extra Features (Optional)

*   **Real-time Posts**: Implement Supabase Realtime to show new posts instantly without page refresh.
*   **Likes/Comments**: Add functionality for users to like or comment on posts.
*   **Image Uploads**: Allow users to upload profile pictures or images with their posts using Supabase Storage.
*   **Search Functionality**: Add a search bar to find users or posts.
*   **Follow/Unfollow**: Implement a social graph for users to follow each other.
