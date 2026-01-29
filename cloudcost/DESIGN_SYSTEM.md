# UI Components Reference Guide

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Cloud Cost & Usage Analyzer (Header)   │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │   MAIN CONTENT               │
│          │   (Dashboard/Insights/etc)   │
│ - Icons  │                              │
│ - Links  │                              │
│ - Hover  │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

## Sidebar Navigation

```
┌─────────────────────────┐
│ Cloud Cost              │
│ & Usage Analyzer        │
├─────────────────────────┤
│ 📊 Dashboard            │
│ 💡 Insights             │
│ 📤 Uploads              │
├─────────────────────────┤
│ [Sign Out Button]       │
└─────────────────────────┘
```

## Dashboard Page Layout

```
┌──────────────────────────────────────┐
│ Cost Overview                        │
│ Track and analyze your cloud spend  │
├──────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │Total │ │  Top │ │ Top  │          │
│ │Cost  │ │Serv.│ │Region│          │
│ │$XXX  │ │Service│ │Region│          │
│ └──────┘ └──────┘ └──────┘          │
├──────────────────────────────────────┤
│ Filter by Date Range                │
│ [From] [To] [Apply] [Clear]         │
├──────────────────────────────────────┤
│ Cost Trend (Line Chart)              │
│ ╰─ With CartesianGrid + Tooltip     │
├──────────────────────────────────────┤
│ ┌─ Top Services ─┐ ┌─ Top Regions ─┐│
│ │ (Bar Chart)    │ │ (Bar Chart)    ││
│ └────────────────┘ └────────────────┘│
└──────────────────────────────────────┘
```

## Insights Card

```
┌─────────────────────────────────────┐
│ 🚨 Service • Region                 │
│    ▲ 35% increase on 2024-01-15     │
├─────────────────────────────────────┤
│ Cost spike detected in this service  │
│ on this date due to increased usage. │
│                                     │
│ [Show Explanation ▼]                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │Why this happened:               │ │
│ │Detailed AI explanation of spike │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Uploads Page Layout

```
┌──────────────────────────────────────┐
│ Cloud Bill Uploads                  │
│ Upload and manage your billing data │
├──────────────────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│ ┃        📤 Upload CSV File      ┃   │
│ ┃ Supports AWS, GCP, Azure       ┃   │
│ ┃ [Select a CSV file]            ┃   │
│ ┃ [Upload & Process]             ┃   │
│ ┃ ✓ Success message              ┃   │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
├──────────────────────────────────────┤
│ ⚡ Detect Cost Spikes               │
│    [Run Spike Detection]             │
│    ✓ Detected 3 new spikes          │
├──────────────────────────────────────┤
│ Upload History (2)                   │
│ ┌──────────────────────────────────┐ │
│ │📄 file1.csv        ✓ COMPLETED   │ │
│ │                                   [🗑] │
│ ├──────────────────────────────────┤ │
│ │📄 file2.csv        ⏳ PROCESSING │ │
│ │                                   [🗑] │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## Color Coding System

### Severity Levels (Insights)
- 🔴 **Red** (>50% increase): Critical spike
- 🟠 **Amber** (<50% increase): Warning spike

### Status Indicators (Uploads)
- 🟢 **Green** (COMPLETED): Successfully processed
- 🔵 **Blue** (PROCESSING): Currently working
- 🔴 **Red** (FAILED): Error occurred
- 🟠 **Amber** (PENDING): Waiting to start

### Charts
- 🔵 **Blue** (#3b82f6): Cost trends
- 🟢 **Green** (#10b981): Services
- 🟠 **Amber** (#f59e0b): Regions

## Interactive Elements

### Buttons
- **Primary**: Blue background, white text (`bg-blue-600 hover:bg-blue-700`)
- **Secondary**: White background, slate border (`variant="outline"`)
- **Destructive**: Red background (for delete actions)

### Inputs
- Border: slate-300
- Hover: slate-400
- Focus: blue-500 with ring effect
- Background: white

### Cards
- Border: slate-200, 1px
- Background: white or light background variants
- Padding: p-4 to p-6
- Rounded: rounded-lg/xl

### Hover States
- Links: bg-slate-100, text-slate-900
- Cards: shadow-md, slight scale
- Buttons: color/bg darkens

## Animation & Transitions

### Fade & Slide
```css
animate-in fade-in slide-in-from-top-2 duration-300
```
Used for: Explanation reveals

### Spinner
```
⏳ Spinning indicator during async operations
```

### Transitions
```css
transition-all, transition-colors
```
Used for: Hover effects, focus states, color changes

## Responsive Breakpoints

- **3-column grid**: Dashboard metrics (adapts to mobile)
- **2-column grid**: Dashboard charts (stacks on mobile)
- **Full-width**: Single sections (upload, filters)

## Accessibility Features

✓ Good contrast ratios (WCAG AA)
✓ Focus visible on interactive elements
✓ Semantic HTML (`<button>`, `<input>`, etc.)
✓ Icon + text labels together
✓ Clear button purposes and labels
✓ Loading states clearly communicated

