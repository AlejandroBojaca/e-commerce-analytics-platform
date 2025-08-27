# Real-Time E-commerce Analytics Dashboard

A modern, responsive dashboard built with Next.js 14, TypeScript, and Tailwind CSS that demonstrates real-time data streaming capabilities for e-commerce analytics.

## 🚀 Features

- **Real-time Dashboard**: Live metrics, sales data, and user activity
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient state management
- **Data Fetching**: TanStack Query for server state management
- **Responsive Design**: Mobile-first responsive design
- **Demo Mode**: Realistic demo data generation for testing

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ecommerce-analytics-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/         # Dashboard pages
│   ├── products/          # Product management
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── store/                 # Zustand stores
└── types/                 # TypeScript type definitions
```

## 🎮 Demo Mode

The application includes a demo mode that generates realistic data:

- Live user metrics
- Real-time sales data
- User activity events
- Inventory alerts
- Notifications

## 📊 Dashboard Features

### Metrics Cards
- Live user count
- Total orders
- Revenue tracking
- Conversion rates

### Sales Chart
- Real-time sales visualization
- Time range filtering
- Interactive tooltips

### Activity Feed
- Live user activity stream
- Event type categorization
- Real-time updates

### Inventory Alerts
- Low stock notifications
- Critical inventory warnings
- Alert severity levels

## 🔄 Real-time Updates

The application is designed to work with WebSocket connections for real-time updates. In demo mode, it simulates this functionality with:

- Periodic metric updates
- Simulated user activities
- Random inventory alerts
- Order notifications

## 🎨 UI Components

Built with a comprehensive set of reusable components:

- **Cards**: Metric cards, content cards
- **Charts**: Sales charts, data visualization
- **Forms**: Inputs, selects, buttons
- **Navigation**: Sidebar, header, breadcrumbs
- **Feedback**: Notifications, alerts, loading states

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Adaptive Layout**: Responsive grid systems
- **Touch-friendly**: Mobile-optimized interactions
- **Cross-browser**: Compatible with modern browsers

## 🚀 Production Build

To create a production build:

```bash
npm run build
npm run start
```