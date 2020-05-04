import React from 'react';
import ChartistGraph from 'react-chartist';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
const data = {
    data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[12, 17, 7, 17, 23, 18, 38]]
    },
    options: {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    },
};

export default function UsageChart() {
    return (
        <div>
            <ChartistGraph
                data={data.data}
                type="Line"
                options={data.options}
            />            
        </div>
    );
}

