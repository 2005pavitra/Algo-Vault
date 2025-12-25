import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Heatmap = ({ data }) => {
    const safeData = data || [];

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Submission Activity</h2>
                <div className="text-xs text-gray-500">
                    Less <span className="inline-block w-3 h-3 bg-gray-100 rounded-sm align-middle mx-1"></span>
                    <span className="inline-block w-3 h-3 bg-green-200 rounded-sm align-middle mx-1"></span>
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-sm align-middle mx-1"></span>
                    <span className="inline-block w-3 h-3 bg-green-600 rounded-sm align-middle mx-1"></span>
                    <span className="inline-block w-3 h-3 bg-green-800 rounded-sm align-middle mx-1"></span> More
                </div>
            </div>

            <CalendarHeatmap
                startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                endDate={new Date()}
                values={safeData}
                classForValue={(value) => {
                    if (!value || value.count === 0) {
                        return 'color-empty';
                    }
                    const count = value.count;
                    if (count >= 10) return 'color-scale-4';
                    if (count >= 5) return 'color-scale-3';
                    if (count >= 2) return 'color-scale-2';
                    return 'color-scale-1';
                }}
                tooltipDataAttrs={value => {
                    if (!value || !value.date) return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No contributions', 'data-tooltip-place': 'top' };
                    return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': `${value.count} submissions on ${value.date}`,
                        'data-tooltip-place': 'top'
                    };
                }}
                showWeekdayLabels
            />
            <ReactTooltip id="heatmap-tooltip" />

            <style>{`
        .react-calendar-heatmap text { font-size: 10px; fill: #6b7280; }
        .react-calendar-heatmap .color-empty { fill: #f3f4f6; } /* gray-100 */
        .react-calendar-heatmap .color-scale-1 { fill: #bbf7d0; } /* green-200 */
        .react-calendar-heatmap .color-scale-2 { fill: #4ade80; } /* green-400 */
        .react-calendar-heatmap .color-scale-3 { fill: #16a34a; } /* green-600 */
        .react-calendar-heatmap .color-scale-4 { fill: #166534; } /* green-800 */
        
        .react-calendar-heatmap rect:hover { stroke: #555; stroke-width: 1px; }
      `}</style>
        </div>
    );
};
export default Heatmap;
