# SportsQuiz Theme Design System

This document describes the consistent design theme applied across the SportsQuiz application.

## Color Palette

### Primary Colors
- **Purple (Primary Action)**: `purple-600` (active states, CTAs)
- **Gray (Neutral)**: Various shades for text and backgrounds
  - `gray-900`: Primary text
  - `gray-800`: Secondary headings
  - `gray-700`: Tertiary text
  - `gray-600`: Muted text

### Background Colors
- **Page Background**: Soft pastel gradient
  ```css
  background-image:
    radial-gradient(1200px 800px at 20% 10%, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 255, 0.85) 40%, rgba(248, 241, 235, 0.8) 100%),
    linear-gradient(180deg, #fbf7ff 0%, #f7f2ee 100%);
  ```
- **Card Backgrounds**: `bg-white` with subtle transparency options
- **Glass Effect**: `bg-white/70` or `bg-white/80` with `backdrop-blur-md`

## Typography

### Headings
- **Page Title (H1)**: `text-2xl font-bold tracking-tight text-gray-900`
- **Card Title**: `text-lg font-semibold text-gray-800` (was purple, now gray)
- **Card Description**: `text-sm text-gray-600`

### Body Text
- **Primary**: `text-gray-700`
- **Secondary**: `text-gray-600`
- **Muted**: `text-muted-foreground text-xs`

## Component Patterns

### Header Bar
Consistent sticky header across all pages:
```tsx
<div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
  <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Page Title</h1>
  </div>
</div>
```

### Cards
Standard card styling:
```tsx
<Card className="w-[280px] h-[220px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
  <CardHeader className="sticky top-0 z-10 rounded-none border-b bg-gray-100/90 backdrop-blur supports-[backdrop-filter]:bg-gray-100/80 py-3">
    <CardTitle className="text-base font-semibold text-gray-800">Title</CardTitle>
  </CardHeader>
  <CardContent className="mt-4 flex items-center justify-center">
    {/* Content */}
  </CardContent>
  <CardFooter className="flex-col items-start gap-1 text-xs text-muted-foreground pb-4">
    {/* Footer */}
  </CardFooter>
</Card>
```

### Grid Layout
Responsive grid for card layouts:
```tsx
<div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 gap-y-12 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Cards */}
</div>
```

### Navigation Sidebar
Clean glass effect with rounded buttons:
- **Background**: `bg-white/70 backdrop-blur-md`
- **Active State**: `bg-purple-600 text-white shadow-sm`
- **Hover State**: `hover:bg-gray-100`
- **Borders**: `border-gray-200/60`

## Spacing

### Card Spacing
- **Between Cards (Horizontal)**: `gap-x-16` (64px)
- **Between Cards (Vertical)**: `gap-y-12` (48px)
- **Page Padding**: `p-8`
- **Card Content**: `mt-4` for top margin

### Dimensions
- **Standard Card**: `w-[280px] h-[220px]`
- **Game Card**: `w-[280px] h-[240px]` (slightly taller)
- **Leaderboard Card**: `w-[280px] h-[540px]` (tall scrollable)
- **Max Width Container**: `max-w-7xl` (1280px)

## Borders & Shadows

### Borders
- **Standard**: `border border-gray-200`
- **Header Divider**: `border-b border-gray-200/60`
- **Rounded Corners**: 
  - Cards: `rounded-xl`
  - Buttons: `rounded-lg`
  - Small elements: `rounded-md`

### Shadows
- **Card Default**: `shadow-sm`
- **Card Hover**: `shadow-md`
- **Header Bar**: `shadow-sm`

## Interactive States

### Buttons
```tsx
className="rounded-lg bg-white px-2 shadow transition-all hover:bg-gray-100 active:scale-95"
```

### Links/Cards
```tsx
className="cursor-pointer transition-all active:scale-95"
```

### Hover Effects
- Cards: `hover:shadow-md`
- Buttons: `hover:bg-gray-100`
- Sidebar items: `hover:bg-gray-100`

## Backdrop Effects

Glass morphism pattern used throughout:
- `backdrop-blur-md` or `backdrop-blur`
- Semi-transparent backgrounds (`bg-white/70`, `bg-white/80`)
- Applied to: Header bar, sidebar, card headers

## Z-Index Hierarchy

1. **Modals**: `z-50`
2. **Header Bar**: `z-2`
3. **Card Headers**: `z-10`
4. **Sidebar**: `z-1`

## Page-Specific Patterns

### Home Page
- Grid of sport category cards
- "Join Game" card integrated into grid
- Header bar with logo and "SportsQuiz" branding

### Games Page
- Same grid layout with game type cards
- Dynamic sport name in header

### Profile/Friends/Leaderboard
- Single large card or grid of cards
- Integrated charts with consistent styling

### Gamelog
- Table with glass header
- Modal overlay for additional details

### Results
- List view with hover states
- Dividers between items

## Implementation Notes

1. All card headers use **gray** instead of purple for consistency
2. Active navigation items use **purple-600** with white text
3. All pages follow the same header bar + content area pattern
4. Spacing is generous: 64px horizontal, 48px vertical between cards
5. Glass effect (backdrop-blur) used for layered elements
6. Consistent `max-w-7xl` container for all pages
7. Used Visily AI for the template of the final color scheme.

