# TODO App - React Router + Cloudflare Workers

A modern, production-ready TODO application built with React Router v7 and deployed on Cloudflare Workers.

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete todos
- 🔄 **Real-time State Management**: Toggle completion status
- ✏️ **Inline Editing**: Edit todos directly in the interface
- 📱 **Responsive Design**: Mobile-first, touch-friendly interface
- 🗄️ **Persistent Storage**: SQLite D1 database
- 🚀 **Edge Deployment**: Cloudflare Workers for global performance
- ⚡️ **Hot Module Replacement**: Fast development experience
- 🔒 **TypeScript**: Full type safety
- 🎨 **TailwindCSS**: Modern, responsive styling

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

1. **Database Setup** - Run an initial database migration:

```bash
npm run db:migrate
```

2. **Start Development Server**:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 🚀 Deployment to Cloudflare Workers

### Prerequisites

1. **Cloudflare Account** - Create a free account at [cloudflare.com](https://cloudflare.com)
2. **API Token** - Create an API token with the following permissions:
   - Account: `Cloudflare Workers:Edit`
   - Account: `D1:Edit`
   - Zone: `Zone:Read` (if using custom domain)

### Deployment Steps

1. **Create D1 Database**:
```bash
npx wrangler d1 create todo-db
```

2. **Update Configuration** - Update `wrangler.jsonc` with the generated database ID:
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "todo-db",
      "database_id": "your-database-id-here"
    }
  ]
}
```

3. **Run Production Migration**:
```bash
CLOUDFLARE_API_TOKEN="your-token" npx wrangler d1 migrations apply todo-db --remote
```

4. **Deploy to Production**:
```bash
npm run deploy
```

5. **Register Workers.dev Subdomain** (if needed):
   - Visit the provided dashboard URL to register your subdomain
   - Or configure a custom domain in Cloudflare Dashboard

### Environment Variables

Set your API token as an environment variable:
```bash
export CLOUDFLARE_API_TOKEN="your-api-token"
```

### Database Management

**Local Development:**
```bash
# Check local database
npx wrangler d1 execute --local DB --command "SELECT * FROM todos;"

# Apply local migrations
npm run db:migrate
```

**Production:**
```bash
# Check production database
npx wrangler d1 execute --remote DB --command "SELECT * FROM todos;"

# Apply production migrations
npx wrangler d1 migrations apply todo-db --remote
```

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

## 📱 Features & Usage

- **Add TODOs**: Use the input field to create new tasks
- **Toggle Completion**: Click the checkbox to mark tasks as complete/incomplete
- **Edit TODOs**: Click on the task text to edit inline
- **Delete TODOs**: Click the trash icon to remove tasks
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

- **Frontend**: React Router v7, React 19, TypeScript
- **Styling**: TailwindCSS with responsive design
- **Database**: SQLite (D1 for Cloudflare Workers)
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Deployment**: Cloudflare Workers with Edge computing
- **ORM**: Drizzle ORM for type-safe database operations

---

Built with ❤️ using React Router v7 and Cloudflare Workers.
