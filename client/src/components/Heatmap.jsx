import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Heatmap = ({ data }) => {
    const safeData = data || [];

    return (
        <div className="w-full">
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
                    if (count >= 3) return 'color-scale-2';
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
                showWeekdayLabels={false}
            />
            <ReactTooltip id="heatmap-tooltip" style={{ backgroundColor: "#1e1b4b", color: "#e0e7ff", borderRadius: "8px" }} />

            <style>{`
                .react-calendar-heatmap text { font-size: 14px; fill: #94a3b8; font-family: 'Space Grotesk', monospace; font-weight: 500; }
                .react-calendar-heatmap .color-empty { fill: #1e293b; rx: 4px; } /* slate-800 */
                
                /* DEFAULT: Intensity Scale (Dark Mode: Dim -> Bright/Neon) */
                .react-calendar-heatmap .color-scale-1 { fill: #064e3b; rx: 4px; transition: fill 0.3s ease; } /* green-900 (Low) */
                .react-calendar-heatmap .color-scale-2 { fill: #15803d; rx: 4px; transition: fill 0.3s ease; } /* green-700 */
                .react-calendar-heatmap .color-scale-3 { fill: #22c55e; rx: 4px; transition: fill 0.3s ease; } /* green-500 */
                .react-calendar-heatmap .color-scale-4 { fill: #4ade80; rx: 4px; transition: fill 0.3s ease; filter: drop-shadow(0 0 4px rgba(74, 222, 128, 0.5)); } /* green-400 (High + Glow) */

                /* HOVER: Intensity Scale (Blue/Cyan) */
                .group:hover .react-calendar-heatmap .color-scale-1 { fill: #0c4a6e; } /* sky-900 */
                .group:hover .react-calendar-heatmap .color-scale-2 { fill: #0369a1; } /* sky-700 */
                .group:hover .react-calendar-heatmap .color-scale-3 { fill: #0ea5e9; } /* sky-500 */
                .group:hover .react-calendar-heatmap .color-scale-4 { fill: #38bdf8; filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.5)); } /* sky-400 + Glow */
                
                .react-calendar-heatmap rect { rx: 3px; } 
                .react-calendar-heatmap rect:hover { stroke: #fff; stroke-width: 1px; transition: all 0.2s ease; }
            `}</style>
        </div>
    );
};
export default Heatmap;
