# Next.js interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Nextjs Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nextjs-fundamentals

## Next.js; Next.js Framework; React Framework; SSR; SSG; Full Stack React

- Next.js is a React framework used to build production-ready web applications.

- It gives routing, server rendering, API routes, image optimization, and build setup out of the box.

- It is useful when the app needs better SEO, faster page loading, and backend logic with frontend code.

- Plain React mainly handles UI, but Next.js gives extra features needed for real projects.

- Real example: blogs, landing pages, dashboards, and e-commerce apps commonly use Next.js.

```
# Create a new Next.js project
npx create-next-app@latest my-app

# Go inside the project folder
cd my-app

# Start the local development server
npm run dev
```

## Next.js vs React; React vs Next.js; Framework vs Library; When To Use Next.js

- React | Next.js

- UI library | React framework
- Needs extra routing setup | Has built-in routing
- Mostly client-side by default | Supports SSR, SSG, and client rendering
- Good for simple UI apps | Good for production web apps

- React helps build UI components.

- Next.js uses React and adds routing, rendering, SEO, and backend features.

- React is flexible but needs extra setup for routing, SEO, and server features.

- Next.js is better when building public websites that need SEO and fast loading.

- Real example: a portfolio can use React, but an e-commerce site is better with Next.js.

## App Router vs Pages Router; Next.js App Router; Pages Router; Next.js Routing

- App Router | Pages Router

- Newer routing system | Older routing system
- Uses app folder | Uses pages folder
- Supports layouts easily | Layouts need extra setup
- Recommended for new apps | Common in older projects

- App Router is the modern routing system in Next.js.

- Pages Router is the older routing system used before Next.js 13.

- App Router supports layouts, server components, loading UI, and error UI more cleanly.

- For new projects, App Router is usually preferred.

- In real projects, you may still see Pages Router in older codebases.

## create-next-app; Next.js CLI; New Next.js Project; Project Setup

- create-next-app is the official way to create a new Next.js project.

- It creates the folder structure and installs required dependencies.

- It can set up TypeScript, ESLint, Tailwind, and App Router during project creation.

- It saves time because we do not need to configure everything manually.

- Real example: use it to quickly start an interview assignment or practice project.

```
# Create a new Next.js project
npx create-next-app@latest my-app

# Move into the project folder
cd my-app

# Run the project locally
npm run dev
```

## Next.js Features; Routing; Rendering; Image Optimization; API Routes

- File-based routing creates routes from folders and files.

- Server rendering helps pages load faster and improves SEO.

- Image optimization improves image loading and performance.

- API routes let us create backend endpoints inside the same project.

- TypeScript support helps catch errors during development.

## File Based Routing; Next.js Routes; App Folder Routing; Pages Folder Routing

- File-based routing means files and folders automatically become routes.

- In App Router, routes are created inside the app folder.

- A page.jsx or page.tsx file represents a page for that route.

- This removes the need for manual route configuration like React Router.

- Real example: app/about/page.jsx becomes the /about route.

```
app/
  page.jsx
  about/
    page.jsx
```

```
// app/about/page.jsx
export default function AboutPage() {
  // This page is shown at /about
  return <h1>About Page</h1>
}
```

## Layout In Next.js; Shared Layout; Root Layout; Nested Layout

- A layout is shared UI that stays common between pages.

- Common examples are navbar, sidebar, footer, and page wrapper.

- In App Router, layout.jsx is used to create shared layouts.

- Nested layouts help different sections have different page structures.

- Real example: dashboard pages can share the same sidebar layout.

```
// app/layout.jsx
export default function RootLayout({ children }) {
  // children means the current page content
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

## next/image; Image Optimization; Responsive Images; Lazy Loading Images

- next/image is used to load images in an optimized way.

- It can resize, lazy load, and improve image performance automatically.

- It helps reduce page load time, especially for image-heavy websites.

- It is better than a normal  tag in most Next.js projects.

- Real example: product images in an e-commerce app can load faster using Image .

```
import Image from "next/image"

export default function ProductImage() {
  // Next.js optimizes this image automatically
  return (
    <Image
      src="/product.png"
      alt="Product"
      width={300}
      height={300}
    />
  )
}
```

## API Routes In Next.js; Route Handlers; Backend API; Serverless Functions

- API routes let us create backend endpoints inside a Next.js project.

- They are useful for forms, auth, database calls, and small backend logic.

- In App Router, we create API routes using route.js or route.ts .

- API route code runs on the server, not directly in the browser.

- Real example: a contact form can submit data to /api/contact .

```
// app/api/hello/route.js
export async function GET() {
  // Send JSON response from the server
  return Response.json({ message: "Hello from API" })
}
```

## SEO In Next.js; Metadata; Head Tags; Search Engine Optimization

- Next.js helps improve SEO by rendering pages on the server.

- We can add page title, description, and metadata easily.

- Server-rendered HTML is easier for search engines to read.

- Good SEO is useful for blogs, landing pages, documentation, and e-commerce.

- Real example: product pages can have unique title and description for Google search.

```
// app/about/page.jsx
export const metadata = {
  // This title appears in browser tab and search results
  title: "About Us",

  // This description helps search engines understand the page
  description: "Learn more about our company",
}

export default function AboutPage() {
  return <h1>About Us</h1>
}
```

Up next

Nextjs Rendering and Data Fetching

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nextjs Rendering and Data Fetching

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nextjs-rendering-and-data-fetching

## SSR vs SSG vs CSR vs ISR; Rendering Strategies; Server Side Rendering; Static Generation; Client Side Rendering

- SSR | SSG | CSR | ISR

- Page is built on every request | Page is built during build time | Page is built in the browser | Static page updates after a time gap
- Data is fresh | Page is very fast | Good for user-only data | Fast and still updates later
- Example: user dashboard | Example: blog page | Example: live chart | Example: product page

- SSR is useful when the page needs fresh data every time.

- SSG is best for pages that do not change often.

- CSR is useful for browser-only features after the page loads.

- ISR is useful when we want static speed with automatic updates.

## SSR; Server Side Rendering; Server-Side Rendering; Per Request Rendering; Next.js SSR

- SSR means the page HTML is created on the server for every request.

- We use SSR when the page needs fresh data for each user.

- The main benefit is that users get a page with real data already loaded.

- Real example: a logged-in dashboard can show latest orders using SSR.

- SSR is fresher than SSG, but it can be slower because the server works on every request.

```
async function DashboardPage() {
  const orders = await getOrders()
  return <OrderList orders={orders} />
}
```

## SSG; Static Site Generation; Build Time Rendering; Static Page; Next.js SSG

- SSG means the page HTML is created during build time.

- We use SSG for pages where content does not change frequently.

- The main benefit is very fast loading because the page can be served from CDN.

- Real example: a blog page, documentation page, or landing page can use SSG.

- SSG is faster than SSR, but the data may become old until the next build or revalidation.

```
export async function getStaticProps() {
  const posts = await fetchPosts()
  return { props: { posts } }
}
```

## ISR; Incremental Static Regeneration; Revalidate; Static Page Update; Next.js ISR

- ISR means a static page can update again after a fixed time.

- We use ISR when we want static speed but also need updated content.

- The main benefit is that we do not need to rebuild the full project for every content change.

- Real example: a product page can refresh price or stock every few minutes.

- ISR is like SSG with automatic background regeneration.

```
fetch(url, { next: { revalidate: 60 } })
```

## CSR; Client Side Rendering; Client-Side Rendering; Browser Rendering; Next.js CSR

- CSR means the browser loads JavaScript first and then fetches data.

- We use CSR for user-specific or live data that does not need SEO.

- The main benefit is that the page can update in the browser without a full reload.

- Real example: an analytics chart can fetch live stats after the page opens.

- CSR is not the best choice for public SEO pages because initial HTML may not have full content.

```
'use client'
function Dashboard() {
  const { data } = useSWR('/api/stats', fetcher)
  return <Chart data={data} />
}
```

## React Server Components; RSC; Server Component; No Client Bundle; App Router Component

- React Server Components run only on the server.

- We use them to fetch data directly without sending extra JavaScript to the browser.

- The main benefit is better performance because less client-side JavaScript is shipped.

- Real example: a product list can read data on the server and render HTML.

- Server Components cannot use useState , useEffect , browser APIs, or click events.

```
async function ProductList() {
  const products = await getProducts()
  return products.map(product => <li key={product.id}>{product.name}</li>)
}
```

## Server Components vs Client Components; use client; RSC vs Client Component; Next.js Components

- Server Components | Client Components

- Run on the server | Run in the browser
- Can fetch data directly | Can use browser events
- Cannot use useState | Can use useState
- Good for data and layout | Good for forms and buttons

- Server Components are default in the App Router.

- Client Components need "use client" at the top of the file.

- Use Client Components for forms, buttons, modals, tabs, and browser events.

- Keep Client Components small to reduce browser JavaScript.

```
'use client'
function SearchBox() {
  const [text, setText] = useState('')
  return <input value={text} onChange={e => setText(e.target.value)} />
}
```

## getServerSideProps; Server Side Props; Pages Router SSR; Fetch Data Per Request

- getServerSideProps is used in the Pages Router to fetch data on every request.

- We use it when a page needs fresh data before rendering.

- The main benefit is that the page receives data as props from the server.

- Real example: a user profile page can read cookies and load current user data.

- getServerSideProps works only inside the pages/ directory.

```
export async function getServerSideProps(context) {
  const user = await getUser(context.req)
  return { props: { user } }
}
```

## getStaticProps; Static Props; Pages Router SSG; Fetch Data At Build Time

- getStaticProps is used in the Pages Router to fetch data during build time.

- We use it for static pages like blogs, docs, and landing pages.

- The main benefit is fast page loading because the HTML is already generated.

- It can return props , revalidate , notFound , or redirect .

- getStaticProps works only inside the pages/ directory.

```
export async function getStaticProps() {
  return { props: { posts }, revalidate: 60 }
}
```

## getStaticPaths; Static Paths; Dynamic Routes; Pre Render Dynamic Pages

- getStaticPaths is used with dynamic routes like [id].tsx or [slug].tsx .

- We use it to tell Next.js which dynamic pages should be generated at build time.

- The main benefit is that dynamic pages can still load like static pages.

- Real example: a blog can pre-build pages for each post slug.

- In App Router, the similar feature is generateStaticParams .

```
return {
  paths: [{ params: { id: '1' } }],
  fallback: 'blocking'
}
```

## Data Fetching In App Router; Async Server Component; fetch cache; Next.js App Router Data

- In App Router, Server Components can fetch data directly using await .

- We use this because it avoids extra boilerplate like getServerSideProps .

- Use cache: 'no-store' when you need fresh data on every request.

- Use next: { revalidate: 60 } when you want ISR-style caching.

- App Router data fetching is mainly controlled by fetch() cache options.

```
const res = await fetch('/api/posts', {
  next: { revalidate: 30 }
})
```

## Hydration; React Hydration; Hydration Mismatch; Client Side Interactivity

- Hydration means React connects JavaScript behavior to server-rendered HTML.

- We use hydration so the page becomes interactive in the browser.

- The main benefit is that users see HTML first and get interactivity after JavaScript loads.

- Hydration mismatch happens when server HTML and client HTML are different.

- Browser-only code like window or Date.now() should usually run inside useEffect .

```
'use client'
function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => setTime(new Date().toLocaleTimeString()), [])
  return <span>{time}</span>
}
```

## loading.tsx and error.tsx; Loading UI; Error UI; Suspense; App Router Special Files

- loading.tsx shows a loading UI while a route segment is loading.

- error.tsx shows a fallback UI when a route segment has an error.

- We use these files to keep loading and error handling clean.

- The main benefit is that we do not need to write manual loading logic in every page.

- error.tsx must be a Client Component because it receives a reset function.

```
export default function Loading() {
  return <p>Loading...</p>
}
```

Previous

Nextjs Fundamentals

Up next

Nextjs Routing and Middleware

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nextjs Routing and Middleware

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nextjs-routing-and-middleware

## Routing In Next.js; File Based Routing; App Router; Pages Router; Next.js Routes

- Next.js creates routes from your folder and file structure.

- In App Router, every page.tsx file becomes a page URL.

- We do not need a separate route configuration like React Router.

- Nested folders create nested URLs automatically.

- Dynamic routes use square brackets like [id] or [slug] .

```
app/
  page.tsx                    // This creates the home route: /
  dashboard/
    page.tsx                  // This creates: /dashboard
  products/
    [id]/
      page.tsx                // This creates dynamic routes like: /products/123
```

## Dynamic Routes In Next.js; Dynamic Segment; Bracket Route; [slug]; [id]

- Dynamic routes are used when part of the URL can change.

- We create them by wrapping the folder name in square brackets like [slug] .

- The dynamic value comes from params inside the page component.

- This is useful for blog posts, product details, and user profiles.

- Multiple dynamic segments can be used in one route.

```
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  // Get the dynamic slug value from the URL
  const { slug } = await params

  // Fetch blog data based on the slug
  const post = await getPost(slug)

  // Show the blog content on the page
  return <article>{post.content}</article>
}
```

## Catch All Routes In Next.js; [...slug]; Optional Catch All Route; [[...slug]]; Multiple URL Segments

- Catch-all routes are used to handle multiple URL parts.

- [...slug] captures all extra path values as an array.

- [[...slug]] also supports the parent route with no extra path.

- This is useful for docs pages, category pages, and CMS routes.

- Example: /docs/api/overview can be handled by one catch-all route.

```
// app/docs/[...slug]/page.tsx
export default async function DocsPage({ params }) {
  // Example URL: /docs/api/overview
  const { slug } = await params

  // Convert ['api', 'overview'] into 'api/overview'
  const path = slug.join('/')

  // Load content based on the full path
  const content = await getDoc(path)

  return <DocViewer content={content} />
}
```

## Route Groups In Next.js; App Router Groups; Parentheses Folder; Organize Routes; Group Layouts

- Route groups help organize files without changing the URL.

- We create a route group using parentheses like (dashboard) .

- The group folder name does not appear in the browser URL.

- This is useful when different sections need different layouts.

- Example: marketing pages and dashboard pages can have separate layouts.

```
app/
  (marketing)/
    page.tsx                  // URL: /
    about/page.tsx            // URL: /about
    layout.tsx                // Layout only for marketing pages

  (dashboard)/
    overview/page.tsx         // URL: /overview
    settings/page.tsx         // URL: /settings
    layout.tsx                // Layout only for dashboard pages
```

## Nested Layouts In Next.js; layout.tsx; Shared Layout; App Router Layout; Section Layout

- layout.tsx is used to share UI between multiple pages.

- Layouts can be nested folder by folder.

- The root layout wraps the full application.

- Section layouts can wrap only one part of the app, like dashboard pages.

- This helps keep sidebars, headers, and footers reusable.

```
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* This top nav appears on all pages */}
        <TopNav />

        {/* Current page content comes here */}
        {children}
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar appears only on dashboard pages */}
      <Sidebar />

      {/* Dashboard page content comes here */}
      <main>{children}</main>
    </div>
  )
}
```

## Middleware In Next.js; middleware.ts; Auth Middleware; Route Protection; Redirect Middleware

- Middleware runs before the request reaches the page or API route.

- It is commonly used for authentication, redirects, and route protection.

- matcher decides which routes should run the middleware.

- Middleware runs on the Edge runtime, so it should stay lightweight.

- Example: redirect users to login if they do not have a session.

```
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(req) {
  // Read session value from browser cookies
  const session = req.cookies.get('session')

  // If session is missing, send user to login page
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If session exists, continue to the requested page
  return NextResponse.next()
}

export const config = {
  // Run middleware only for these protected routes
  matcher: ['/dashboard/:path*', '/account/:path*']
}
```

## Link Component In Next.js; next/link; Client Side Navigation; Prefetching; Internal Links

-  is used for navigation between internal pages.

- It avoids full page reloads and makes navigation faster.

- Next.js can prefetch linked pages in the background.

- Use  for normal page navigation inside the app.

- Use useRouter() when navigation should happen from JavaScript logic.

```
import Link from 'next/link'

// Simple internal page navigation
<Link href="/about">About Us</Link>

// Dynamic page navigation
<Link href={'/blog/' + post.slug}>{post.title}</Link>
```

```
import { useRouter } from 'next/navigation'

function GoToDashboardButton() {
  // Router is used for navigation from code
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

## Shallow Routing In Next.js; Shallow URL Update; Query Params; URL State; No Full Data Refetch

- Shallow routing updates the URL without fully reloading the page.

- It is useful for tabs, filters, search params, and UI state.

- It helps keep the URL in sync with the current screen state.

- It is mainly associated with the Pages Router behavior.

- Example: changing a tab can update the URL without refetching the full page.

```
// Update the URL query without fully reloading page data
router.push('?tab=settings', undefined, { shallow: true })
```

## Custom Server In Next.js; Express Server; Fastify Server; Next.js Server; Legacy Backend Routes

- A custom server means using your own server instead of the default Next.js server.

- It is usually built with Express or Fastify.

- It can be useful for WebSockets, legacy APIs, or custom backend middleware.

- It adds more control, but also more deployment complexity.

- In most modern Next.js apps, the default Next.js server is enough.

```
const next = require('next')
const express = require('express')

// Create a Next.js app instance
const app = next({ dev: process.env.NODE_ENV !== 'production' })

// Let Next.js handle normal page requests
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Add old or custom API routes here
  server.use('/api/legacy', legacyApiRouter)

  // Send all other requests to Next.js
  server.all('*', (req, res) => handle(req, res))

  // Start the custom server
  server.listen(3000)
})
```

Previous

Nextjs Rendering and Data Fetching

Up next

Nextjs Configuration

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nextjs Configuration

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nextjs-configuration

## next.config.js; Next.js Config File; Next Configuration; Project Settings

- next.config.js is the main configuration file for a Next.js project.

- We use it to set images, redirects, rewrites, headers, environment settings, and build options.

- It helps control project behavior without changing page or component code.

- Real example: we can allow images from an external CDN using this file.

- After changing next.config.js , restart the Next.js server to apply the changes.

```
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.example.com'],
  },
}
```

## Environment Variables; Env Variables; NEXT_PUBLIC; process.env; Next.js Secrets

- Environment variables store values that may change between local, staging, and production.

- We use them for API URLs, database URLs, secret keys, and public configuration values.

- Variables without NEXT_PUBLIC_ are server-only and should be used for secrets.

- Variables with NEXT_PUBLIC_ are exposed to the browser, so they should not contain private data.

- Real example: store DATABASE_URL for the server and NEXT_PUBLIC_API_URL for the client.

```
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Image Optimization; next/image; Remote Images; WebP; AVIF

- Next.js optimizes images when we use the next/image component.

- It can resize images and serve better formats like WebP or AVIF.

- This improves page speed because the browser receives smaller image files.

- For external images, we must allow the domain in next.config.js .

- Real example: allow product images from a CDN in an e-commerce app.

```
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
  },
}
```

## Rewrites vs Redirects; Next.js Routing; URL Rewrite; URL Redirect

- Redirect | Rewrite

- Sends user to a new URL | Keeps the same URL in browser
- Browser knows URL changed | Browser does not know URL changed
- Useful for old pages | Useful for proxying APIs
- Example: /old to /new | Example: /api to backend

- Redirects are used when the user should move to a different URL.

- Rewrites are used when we want to show content from another path internally.

- Both can be configured inside next.config.js .

- Real example: redirect /old-page to /new-page .

- For rules, keep specific paths before common catch-all paths.

```
{
  source: '/old-page',
  destination: '/new-page',
  permanent: true,
}
```

## Custom Headers; Security Headers; CORS Headers; Next.js Headers

- Custom headers add extra information to the response sent by Next.js.

- We use them for security, caching, CORS, and browser behavior.

- Common security headers include X-Frame-Options , Content-Security-Policy , and Strict-Transport-Security .

- Real example: use X-Frame-Options to stop a page from loading inside an iframe.

- Apply headers only to the needed routes to avoid unwanted behavior.

```
{
  key: 'X-Frame-Options',
  value: 'DENY',
}
```

## Next.js Build Output; next build; Standalone Output; Static Export; Deployment

- next build prepares the Next.js app for production.

- The default build output is used for apps running on a Node.js server.

- output: 'standalone' creates a smaller server build, which is useful for Docker.

- output: 'export' creates a static site, but it does not support SSR, API routes, or middleware.

- Real example: use standalone output when deploying a Next.js app with Docker.

```
module.exports = {
  output: 'standalone',
}
```

## publicRuntimeConfig and serverRuntimeConfig; Runtime Config; Legacy Config; NEXT_PUBLIC Replacement

- publicRuntimeConfig and serverRuntimeConfig are older ways to pass config values in Next.js.

- publicRuntimeConfig can be used on both client and server.

- serverRuntimeConfig is only for server-side values.

- In modern Next.js, prefer environment variables instead of runtime config.

- Use NEXT_PUBLIC_ only for values that are safe to expose in the browser.

```
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const dbUrl = process.env.DATABASE_URL
```

Previous

Nextjs Routing and Middleware

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
