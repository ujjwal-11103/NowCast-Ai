# How to Use the Custom Reporting Drag-and-Drop Builder

This guide explains how to create custom visualizations using the new Drag-and-Drop interface in the Custom Reporting module.

## 1. Access the Builder
1. Navigate to the **Custom Reporting** page.
2. Click the **"Toggle Builder"** button located in the top-right toolbar.
   - This will open the **Configuration Sidebar** on the right side of the screen.

## 2. Understanding the Interface
Once the builder is open, you will see three main zones:
- **Columns List (Left side of sidebar)**: Contains all your data fields (e.g., `sales`, `forecast_sales`, `region`, `profit`).
- **Group By / Split By (Top of sidebar)**: Determines how data is categorized (the X-Axis or Legend).
- **Aggregates (Middle/Bottom)**: Determines the values to plot (the Y-Axis), such as Sum of Sales or Average Growth.

## 3. Creating a Graph (Drag and Drop)
To build a chart, simply **drag fields from the Columns List** into the layout zones:

### Example: Compare Forecast vs Actual Sales by Region
1. **Set the Category (X-Axis)**:
   - Find `region` in the field list.
   - Drag it into the **"Row Pivots"** (or "Group By") section.
   - *Result*: The chart now groups data by Region.

2. **Add Data to Plot (Y-Axis)**:
   - Find `sales` in the field list.
   - Drag it into the **"Columns"** (or "Active") section (often labeled just with the field names currently active).
   - Find `forecast_sales`.
   - Drag it next to `sales`.
   - *Result*: You now see two bars/lines for each region: one for Actual Sales and one for Forecast.

## 4. Switching Chart Types
- Use the **Chart Type Selector** at the top of the sidebar (button with icon like Bar, Line, Grid).
- Click it to choose:
  - **X/Y Scatter**: For correlations.
  - **Treemap**: For hierarchical data.
  - **Heatmap**: For intensity matrices.
  - **Datagrid**: To see the raw numbers.

## 5. Saving Your View
- Once you are happy with the layout, you can verify the data using the summary cards at the top.
- Currently, views reset on refresh, but you can use the **Preset Buttons** (Trend, Waterfall, etc.) to quickly return to standard views.
