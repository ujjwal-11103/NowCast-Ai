# NowcastAI - Clean Application

This is a clean, consolidated version of the NowcastAI application with all dependencies properly structured in one folder.

## 📁 Project Structure

```
NowcastAI-Clean/
├── src/                    # Source code
│   ├── assets/            # Images, fonts, and static assets
│   ├── components/        # Reusable React components
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   ├── context/           # React context providers
│   ├── jsons/             # JSON data files
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components (routes)
│   ├── redux/             # Redux store and slices
│   ├── services/          # API services
│   ├── testing/           # Test utilities
│   ├── utils/             # Helper functions
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Public static files
├── node_modules/          # All dependencies (installed)
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
├── jsconfig.json          # JavaScript configuration
├── tsconfig.json          # TypeScript configuration
├── components.json        # UI components configuration
├── index.html             # HTML entry point
└── README.md              # This file

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🛠️ Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite (latest)
- **Styling**: 
  - Tailwind CSS (latest)
  - Vanilla CSS
  - SASS
- **UI Libraries**:
  - Radix UI components
  - PrimeReact
  - Ant Design
  - Bootstrap
- **Data Visualization**:
  - Plotly.js
  - Chart.js
  - Recharts
  - D3.js
  - Perspective (FINOS)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Data Grid**: 
  - AG Grid
  - Handsontable
- **HTTP Client**: Axios
- **Icons**: React Icons, Lucide React, PrimeIcons

## 📦 Key Dependencies

### Core
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `@reduxjs/toolkit` & `react-redux` - State management

### Visualization
- `plotly.js` & `react-plotly.js` - Interactive charts
- `chart.js` & `react-chartjs-2` - Chart components
- `recharts` - Composable charts
- `d3` - Data visualization
- `@finos/perspective` - Streaming data visualization

### UI Components
- `@radix-ui/*` - Accessible component primitives
- `primereact` - Rich UI component library
- `antd` - Ant Design components
- `react-bootstrap` - Bootstrap components

### Data Management
- `ag-grid-react` - Advanced data grid
- `handsontable` - Excel-like data grid
- `react-pivottable` - Pivot table component
- `xlsx` - Excel file handling

### Utilities
- `axios` - HTTP client
- `moment` & `date-fns` - Date manipulation
- `clsx` & `tailwind-merge` - Class name utilities

## 🎯 Features

Based on the application structure, this app includes:

- **CEO Dashboard** - Executive overview and analytics
- **Sales Performance** - Sales tracking and analysis
- **Custom Reporting** - Drag-and-drop report builder
- **MEIO (Multi-Echelon Inventory Optimization)** - Inventory management
- **Pricing Analyst** - Market mix modeling and pricing analytics
- **Trade Promotion** - Promotion management
- **Profit Pulse** - Profitability analysis
- **Chatbot** - AI-powered assistance with consensus and what-if modes

## 📝 Notes

- This is a clean copy created on 2026-01-17
- All sub-projects (Chemical, Jarvis-Demo-2, ProfitPulse-FE, NowCast-Clean) have been excluded
- All dependencies are freshly installed
- The application is ready to run without any additional setup

## 🔧 Configuration

The application uses:
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **ESLint** for code quality
- **PostCSS** for CSS processing

## 📄 License

Private project - All rights reserved

---

**Created**: January 17, 2026  
**Version**: Clean Copy v1.0
