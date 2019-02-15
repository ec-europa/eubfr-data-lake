// Specific syntax:
// https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files

const budgetItem = {
  properties: {
    currency: { type: 'keyword' },
    raw: { type: 'text' },
    value: { type: 'long' },
    _original: {
      properties: {
        currency: { type: 'keyword' },
        raw: { type: 'text' },
        value: { type: 'long' },
      },
    },
  },
};

const textWithKeyword = {
  type: 'text',
  fields: { keyword: { type: 'keyword', ignore_above: 256 } },
};

const simpleValueField = {
  properties: {
    raw: { type: 'text' },
    formatted: { type: 'text' },
  },
};

const typedValueField = {
  properties: {
    field: { type: 'keyword' },
    type: { type: 'keyword' },
    raw: { type: 'text' },
    formatted: { type: 'text' },
  },
};

module.exports = () => ({
  mappings: {
    project: {
      properties: {
        action: { type: 'text' },
        budget: {
          properties: {
            devco_equity: budgetItem,
            devco_guarantee: budgetItem,
            devco_interest_rate_subsidy: budgetItem,
            devco_investment_grant: budgetItem,
            devco_loan: budgetItem,
            devco_ta: budgetItem,
            eu_contrib: budgetItem,
            funding_area: textWithKeyword,
            mmf_heading: textWithKeyword,
            other_contrib: budgetItem,
            private_fund: budgetItem,
            public_fund: budgetItem,
            total_cost: budgetItem,
          },
        },
        call_year: { type: 'text' },
        comments: { type: 'text' },
        computed_key: { type: 'keyword' },
        created_by: { type: 'keyword' },
        description: { type: 'text' },
        devco_arei_projects_endorsement: simpleValueField,
        devco_cris_number: simpleValueField,
        devco_date_entry: { type: 'date' },
        devco_lead_investor: simpleValueField,
        devco_leverage: simpleValueField,
        devco_project_stage: simpleValueField,
        devco_results_indicators: typedValueField,
        ec_priorities: textWithKeyword,
        last_modified: { type: 'date' },
        media: {
          properties: {
            name: { type: 'text' },
            url: { type: 'text' },
            meta: {
              properties: {
                description: { type: 'text' },
                mime_type: { type: 'text' },
                type: { type: 'text' },
              },
            },
          },
        },
        producer_id: { type: 'keyword' },
        programme_name: textWithKeyword,
        project_id: { type: 'keyword' },
        project_locations: {
          type: 'nested',
          properties: {
            address: { type: 'text' },
            centroid: { type: 'geo_point' },
            country_code: { type: 'keyword' },
            enriched: { type: 'boolean' },
            location: { type: 'geo_shape' },
            nuts: {
              properties: {
                code: { type: 'keyword' },
                name: { type: 'keyword' },
                level: { type: 'integer' },
                year: { type: 'keyword' },
              },
            },
            postal_code: { type: 'keyword' },
            region: { type: 'keyword' },
            town: { type: 'keyword' },
          },
        },
        project_website: { type: 'text' },
        // Client-side indicator whether a project full details should be reachable.
        complete: { type: 'boolean' },
        related_links: {
          properties: {
            label: { type: 'text' },
            url: { type: 'text' },
          },
        },
        reporting_organisation: { type: 'keyword' },
        results: {
          properties: {
            available: { type: 'keyword' },
            result: { type: 'text' },
          },
        },
        status: { type: 'text' },
        sub_programme_name: { type: 'text' },
        success_story: { type: 'text' },
        third_parties: {
          type: 'nested',
          properties: {
            address: { type: 'text' },
            country: { type: 'keyword' },
            email: { type: 'keyword' },
            name: { type: 'keyword' },
            phone: { type: 'keyword' },
            region: { type: 'keyword' },
            role: { type: 'keyword' },
            type: { type: 'keyword' },
            website: { type: 'keyword' },
          },
        },
        timeframe: {
          properties: {
            from: { type: 'date' },
            from_precision: { type: 'text' },
            to: { type: 'date' },
            to_precision: { type: 'text' },
          },
        },
        title: textWithKeyword,
        type: { type: 'text' },
      },
    },
  },
});
