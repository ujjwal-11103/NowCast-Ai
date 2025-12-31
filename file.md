# Changelog / Dev Notes

Here is a summary of the changes I've made since cloning the repo.

### Planning Module UI & Features
- **Forecast Table Layout**: I reordered the columns in the main table. The "Recent Trend", "Long Term Trend", and "Forecast Summary" columns used to be mixed in; I moved them to the end (right side) so the table reads better (Consensus Inputs -> Summary/Trends).
- **Real-time Updates**: Connected the table inputs directly to the charts. Now, when you edit a Consensus value in the grid, the "Consensus Breakup" and trend charts update instantly without needing a refresh.
- **New Breakdown Component**: Added a `ForecastBreakupTable`. This is the new section that shows a detailed breakdown (Trend, Seasonality, Discount, etc.) for each item. I also built a mini "Waterfall Bridge" visualization inside each row of this table.

### Chart Improvements
- **Confidence Intervals**: Updated the `SalesTrendChart` to render a shaded area for confidence intervals (using the `upper_band` and `lower_band` data).
- **Legend Fixes**: The chart legends were overlapping the data. I moved the legend to the top (`orientation: 'h'`) so it's out of the way.
- **Waterfall Chart Logic**: Fixed a visual bug in the waterfall/bridge chart where bars would overlap if you had a negative value followed by a positive one. The math for the starting positions is correct now.

### Bug Fixes & Data Logic
- **Fixed "Value = 0" Bug**: The "Forecast Value" was incorrectly showing as 0 because the `Price` field wasn't being mapped correctly from the API response. I updated `ForecastContext` to grab the correct `Price` key, so the value calculation works now.
- **API Debugging**: I created `inspect_api.js` and saved some `api_*.json` files. These were just temporary scripts I used to check what the backend was actually sending versus what we expected.

### Other
- **Download Button**: Added a "Download Forecast Report" button to the top of the Planning page.
- **Dependencies**: `package-lock.json` updated slightly (probably just from running `npm install`).

### Recent Updates (KrisJarvis)
- **Dynamic Marquee Alerts**:
  - Upgraded the Marquee component to display dynamic, prioritized alerts from the API.
  - Logic added to surface items with active "Alert" flags, showing their ID (`key_new`) and summary.
  - **Layout Update**: Relocated the Marquee bar from the page header to immediately above the "Actual vs Forecast" graph to provide better context to the visual data.
- **Data Mapping**:
  - Updated `ForecastContext.jsx` to correctly map and expose `key_new` and `Alert` fields from the API response.
- **Project Cleanup**:
  - Removed temporary testing files (`api_*.json`, `inspect_api.js`, `all_keys.json`, etc.) to maintain a clean codebase.
