import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Heatmap = ({ data }) => {
    // Default to empty array if no data
    const safeData = data || [];

    return (
        <div className="p-4 bg-white rounded-lg shadow w-full max-w-4xl mx-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Activity Heatmap</h2>
            <CalendarHeatmap
                startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                endDate={new Date()}
                values={safeData}
                classForValue={(value) => {
                    if (!value) {
                        return 'color-empty';
                    }
                    // Simple count based coloring, can be improved
                    const count = value.count;
                    let scale = 0;
                    if (count > 0) scale = 1;
                    if (count > 2) scale = 2;
                    if (count > 5) scale = 3;
                    if (count > 10) scale = 4;
                    return `fill-current text-green-${scale * 200 || 100}`; // Utilizing Tailwind colors via custom class or just generic styles
                }}
                showWeekdayLabels
            />
            {/* Note: Standard react-calendar-heatmap styles need to be overridden or mapped to tailwind colors for 'text-green-*' to work as fill. 
          For simplicity in scaffold, we might need a small custom css snippet for heatmap colors if not using the default. 
      */}
            <style>{`
        .react-calendar-heatmap .color-empty { fill: #ebedf0; }
        .react-calendar-heatmap .color-filled { fill: #8cc665; }
        .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
        .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
      `}</style>
        </div>
    );
};
export default Heatmap;
