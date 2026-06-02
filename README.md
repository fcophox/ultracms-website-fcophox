# fcoPhox Portfolio & Personal Website

> A digital experience that blends strategy, aesthetics, and usability to connect people with the digital world.

Welcome to the repository of my personal portfolio and blog! This project serves as a central hub for my UX/UI case studies, articles on technology and design, and an overview of my methodology as a **UX Engineer & Product Design Consultant**.

---

## 👨‍💻 About the Author

**Francisco Hormazábal (fcoPhox)**  
*UX Engineer & Product Design Consultant*

I bridge the gap between design and engineering. With certifications spanning all 3 levels of UX-PM by the UX Alliance, my work is driven by data, user research, and AI-assisted workflows. I specialize in:
- **UX Research & Strategy:** Data-driven decisions and problem framing.
- **Product Design (UX/UI):** High-fidelity prototyping and design systems.
- **Frontend Engineering:** Modern, performant implementations using React, Next.js, and Tailwind CSS.
- **AI & Innovation Consulting:** Rapid iteration using AI tools to bring MVPs to life.

Connect with me on [LinkedIn](https://www.linkedin.com/in/fcophox/) or explore my work here on [GitHub](https://github.com/fcophox).

---

## 🛠️ Tech Stack & Features

This project was built from the ground up using a modern, scalable, and highly optimized tech stack:

- **Framework:** [Next.js (App Router)](https://nextjs.org/) - *Optimized for server-side rendering and static generation.*
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Tailwind Typography - *Utility-first styling with a sleek dark mode implementation.*
- **Database & Backend:** [Supabase](https://supabase.com/) - *PostgreSQL database for dynamic articles, case studies, and a real-time 'Like' feedback system.*
- **Internationalization (i18n):** [next-intl](https://next-intl-docs.vercel.app/) - *Fully multilingual (English & Spanish), including dynamic SEO metadata translations.*
- **Animations:** [Framer Motion](https://www.framer.com/motion/) - *Smooth micro-interactions and page transitions.*
- **SEO Optimized:** Dynamic OpenGraph tags, automated URL mapping, and custom metadata templates.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/fcophox/ultracms-website-fcophox.git
cd ultracms-website-fcophox
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials (and any other required keys, like Resend API):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

- `src/app/`: Next.js App Router structure containing localized pages, layouts, and API routes.
- `src/components/`: Reusable UI components (Hero, Footer, ArticleFeedback, etc.).
- `messages/`: Localization files (`en.json` and `es.json`) for `next-intl`.
- `src/utils/`: Helper functions and Supabase client configuration.

## 🤝 Contact

If you have a business inquiry, a project in mind, or just want to say hi, feel free to reach out through my website's contact form or on LinkedIn!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
