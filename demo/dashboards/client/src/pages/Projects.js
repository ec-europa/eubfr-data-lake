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
import getProducersBuckets from '../lib/getProducersBuckets';

import Spinner from '../components/Spinner';

class Projects extends React.Component {
  state = {
    isLoading: true,
    projects: [],
  };

  async componentDidMount() {
    const files = [];
    const client = clients.Create();

    // Get a list of S3 buckets hosting producers (ETLs) dashboards.
    const producersBuckets = await getProducersBuckets();

    // Get all available files.
    const results = await client.private.search({
      index: indices.meta,
      type: 'file',
      size: 1000,
    });

    if (results && results.hits && results.hits.hits) {
      files.push(...results.hits.hits);
    }

    const stats = await Promise.all(
      files.map(async file => {
        const computedKey = file._source.computed_key;

        const params = {
          index: indices.projects,
          type: 'project',
          q: `computed_key:"${computedKey}.ndjson"`,
        };

        const { count } = await client.public.count(params);

        return { computedKey, count };
      })
    );

    if (producersBuckets && producersBuckets.length && stats && stats.length) {
      const projects = producersBuckets.map(bucket => {
        const name = bucket.Name.split('-').pop();

        const projectsList = stats
          .filter(file => file.computedKey.includes(name))
          .map(item => item.count)
          .reduce((acc, curr) => acc + curr, 0);

        return { name, Projects: projectsList };
      });

      this.setState({ projects, isLoading: false });
    }
  }

  render() {
    const { isLoading, projects } = this.state;

    // const data = [
    //   {
    //     name: 'bulgaria',
    //     Projects: 1000,
    //     Locations: 1200,
    //     'Locations without enrichment': 0,
    //     'Budget items': 1000,
    //     'Budget items without enrichment': 1000,
    //   },
    //   {
    //     name: 'eac',
    //     Projects: 10000,
    //     Locations: 12000,
    //     'Locations without enrichment': 2000,
    //     'Budget items': 12000,
    //     'Budget items without enrichment': 1000,
    //   },
    // ];

    return isLoading ? (
      <Spinner />
    ) : (
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          layout="vertical"
          data={projects}
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis interval={0} type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Projects" fill="#467A39" />
          {/* <Bar dataKey="Locations" stackId="a" fill="#4073AF" />
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
          /> */}
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default Projects;
