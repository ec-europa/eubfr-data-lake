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

import Spinner from '../components/Spinner';
import handleErrors from '../lib/handleErrors';

class Results extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
    };

    this.clients = null;
  }

  componentDidMount() {
    this.clients = clients.Create();
  }

  render() {
    const data = [
      {
        name: 'bulgaria',
        projects: 1000,
        locations: 1200,
        locations_enriched: 1200,
        budget_items: 1000,
        budget_items_enriched: 800,
      },
      {
        name: 'eac',
        projects: 10000,
        locations: 12000,
        locations_enriched: 10000,
        budget_items: 12000,
        budget_items_enriched: 8000,
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
          <Bar dataKey="projects" fill="#467A39" />
          <Bar dataKey="locations" stackId="a" fill="#4073AF" />
          <Bar dataKey="locations_enriched" stackId="a" fill="#7FA1C9" />
          <Bar dataKey="budget_items" stackId="b" fill="#FFDE39" />
          <Bar dataKey="budget_items_enriched" stackId="b" fill="#FFE879" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default Results;
