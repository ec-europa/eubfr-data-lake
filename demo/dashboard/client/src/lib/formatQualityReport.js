export default report => {
  const formattedReport = [];

  // As requested here https://webgate.ec.europa.eu/CITnet/jira/browse/EUBFR-175?focusedCommentId=2739406&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-2739406
  const desiredFields = [
    'title',
    'description',
    'timeframe.from',
    'timeframe.to',
    'budget.eu_contrib.value',
    'call_year',
    'status',
    'results.result',
    'project_locations.0.country_code',
    'programme_name',
    'sub_programme_name',
    'success_story',
    'action',
    'third_parties.0.name',
    'third_parties.0.type',
    'third_parties.0.address',
    'third_parties.0.region',
    'third_parties.0.role',
    'third_parties.0.country',
  ];

  desiredFields.forEach(field => {
    report.forEach(reportRow => {
      if (reportRow[field]) {
        formattedReport.push(reportRow);
      }
    });
  });

  return formattedReport;
};
