# Data Visualization Project

A web application built with **React (TypeScript)** and **Supabase** to visualize and explore data interactively. This project showcases modern web development practices while providing a user-friendly interface for data representation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Authentication**: User authentication powered by Supabase.
- **Interactive Visualizations**: Dynamic charts and graphs for data representation.
- **TypeScript Support**: Strongly typed codebase for better developer experience.
- **Supabase Integration**: Real-time data fetching and storage.
- **Fake ordering system**: For adding dummy data for showing the visualization
- **Admin System**: The admin can add menu items to the database

---

## Tech Stack

- **Frontend**: React (TypeScript)
- **Backend/Database**: Supabase (PostgreSQL, Auth)
- **Data Visualization**: Recharts
- **Styling**: CSS
- **Build Tool**: Vite

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (>= 16.x)
- **npm** or **yarn**
- A **Supabase Project** (with API keys)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aaqwesas/Web_Visualization.git
   cd data-visualization
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and configure your environment variables. (See [Environment Variables](#environment-variables)).

---

## Usage

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

Serve the production build:

```bash
npm run start
# or
yarn start
```

---

## Environment Variables

The project uses a `.env` file to store environment variables. Create a `.env` file in the root directory and add the following keys:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with the values from your **Supabase project settings**.

---

## Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Copy the **API URL** and **Anon Key** from the project settings.
3. Add them to your `.env` file as shown in the [Environment Variables](#environment-variables) section.
4. Configure your database schema in the Supabase dashboard or using SQL scripts.

---
### Acknowledgements

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Recharts](https://recharts.org/)
- [Vite](https://vite.dev/)

---
