# Bruno GitHub Dashboard

A dashboard application built with Next.js to visualize and analyze GitHub repository data for [Bruno](https://github.com/usebruno/bruno).

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm 

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bruno-github-dashboard.git
cd bruno-github-dashboard
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Data Visualization**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **Icons**: Heroicons

## Data Source

The dashboard uses GitHub API data stored in JSON format in the `data/github-data` directory:
- `issues.json`: Repository issues data
- `prs.json`: Pull request data
- `releases.json`: Release information
- `meta.json`: Repository metadata

## Project Structure

- `src/pages`: Application routes and page components
- `src/components`: Reusable UI components
- `src/providers`: Context providers for data management
- `src/styles`: Global styles and Tailwind configuration

## License
MIT