import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import clients from '../clientFactory';
import indices from '../clientFactory/esIndices';

class Results extends React.Component {
  state = {
    isLoading: true,
  };

  async componentDidMount() {
    const client = clients.Create();

    const results = await client.private.search({
      index: indices.meta,
      type: 'file',
    });

    console.log(results);
  }

  render() {
    const data = [
      {
        name: 'bulgaria',
        Projects: 1000,
        Locations: 1200,
        'Locations without enrichment': 0,
        'Budget items': 1000,
        'Budget items without enrichment': 1000,
      },
      {
        name: 'eac',
        Projects: 10000,
        Locations: 12000,
        'Locations without enrichment': 2000,
        'Budget items': 12000,
        'Budget items without enrichment': 1000,
      },
    ];

    return (
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Projects" fill="#467A39" />
          <Bar dataKey="Locations" stackId="a" fill="#4073AF" />
          <Bar
            dataKey="Locations without enrichment"
            stackId="a"
            fill="#7FA1C9"
          />
          <Bar dataKey="Budget items" stackId="b" fill="#FFDE39" />
          <Bar
            dataKey="Budget items without enrichment"
            stackId="b"
            fill="#FFE879"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default Results;
