import React from 'react';
import ChartistGraph from 'react-chartist';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
const data = {
    data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        series: [[12, 17, 7, 17, 23, 18, 38]]
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

