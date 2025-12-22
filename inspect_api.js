import http from 'http';
import fs from 'fs';

http.get('http://20.235.178.245:3001/api/planning/data', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.success && json.data.length > 0) {
                const allKeys = new Set();
                json.data.forEach(item => {
                    Object.keys(item).forEach(k => allKeys.add(k));
                });
                fs.writeFileSync('all_keys.json', JSON.stringify(Array.from(allKeys).sort(), null, 2));
                console.log("Keys saved to all_keys.json");

                // Save a sample that definitely has 'Trend' or related if possible
                const interestingRow = json.data.find(d => d.Recent_Trend || d.Forecast_Summary);
                if (interestingRow) {
                    fs.writeFileSync('api_forecast_sample_interesting.json', JSON.stringify(interestingRow, null, 2));
                    console.log("Found interesting row!");
                } else {
                    console.log("No interesting row found (checking for Recent_Trend).");
                }

            } else {
                console.log("No data or success false");
            }
        } catch (e) { console.log(e); }
    });
});
