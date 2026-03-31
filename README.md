
# International Journal of Indigenous Knowledge and Cultural Studies (IJKCS) Website

## Overview

This is the official website for the International Journal of Indigenous Knowledge and Cultural Studies (IJKCS), published by the African Centre for Advancement of Indigenous Knowledge and Culture (ACAIKC). The site provides open access to peer-reviewed articles, archives, and information about the journal, its editorial board, and submission guidelines.

## Features

- **Modern UI**: Built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.
- **Authentication**: User authentication and profile management via Supabase.
- **Admin Panel**: Manage articles, users, and journal settings (protected routes).
- **Article Management**: Upload, view, search, and filter journal articles.
- **Open Access**: All articles are freely available for download.
- **Responsive Design**: Works well on desktop and mobile devices.
- **Contact & About Pages**: Information about the journal, editorial board, and contact form.

## Technologies

- React + Vite + TypeScript
- Tailwind CSS & shadcn/ui
- Supabase (database, authentication, storage, edge functions)
- React Query, React Router
- ESLint, Prettier

## Getting Started

1. **Clone the repository**
	```
	git clone <REPO_URL>
	cd ijkcs-journal-website
	```

2. **Install dependencies**
	```
	npm install
	```

3. **Set up environment variables**

	Create a `.env` file with your Supabase project credentials:
	```
	VITE_SUPABASE_URL=...
	VITE_SUPABASE_PUBLISHABLE_KEY=...
	```

4. **Run the development server**
	```
	npm run dev
	```

5. **Build for production**
	```
	npm run build
	```

## Project Structure

- `src/pages/` — Main pages (Home, Archives, About, Contact, Admin, etc.)
- `src/components/` — UI components (including admin and profile subfolders)
- `src/hooks/` — Custom React hooks (authentication, data fetching)
- `src/integrations/supabase/` — Supabase client and types
- `supabase/functions/` — Supabase Edge Functions for backend logic

## Deployment

- Deploy via Vercel, Netlify, or your preferred provider.
- For Lovable users: Use the Lovable dashboard to publish and manage deployments.

## License

Articles are published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See About page for details.
