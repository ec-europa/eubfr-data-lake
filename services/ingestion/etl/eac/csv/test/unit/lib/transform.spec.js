/**
 * @jest-environment node
 */

// There are many files in this ETL, and for this reason variables are same as file names for easier discovery.
/* eslint camelcase: 0 */

import mapper from '../../../src/lib/transform';
import testCoopIndustrialisedCountries_Projects_Overview from '../../stubs/CoopIndustrialisedCountries_Projects_Overview.json';
import testCreativeEurope_Projects_Overview from '../../stubs/CreativeEurope_Projects_Overview.json';
import testCulture_2007_2013_Projects_Overview from '../../stubs/Culture_2007_2013_Projects_Overview.json';
import testErasmusMundus_Projects_Overview from '../../stubs/ErasmusMundus_Projects_Overview.json';
import testErasmusPlus_JeanMonnet_Projects_Overview from '../../stubs/ErasmusPlus_JeanMonnet_Projects_Overview.json';
import testErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview from '../../stubs/ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview.json';
import testErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview from '../../stubs/ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview.json';
import testErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview from '../../stubs/ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview.json';
import testErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview from '../../stubs/ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview.json';
import testErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview from '../../stubs/ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview.json';
import testErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview from '../../stubs/ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview.json';
import testErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview from '../../stubs/ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview.json';
import testErasmusPlus_Sports_Projects_Overview from '../../stubs/ErasmusPlus_Sports_Projects_Overview.json';
import testLifeLongLearning_Projects_Overview from '../../stubs/LifeLongLearning_Projects_Overview.json';
import testSports_Projects_Overview from '../../stubs/Sports_Projects_Overview.json';
import testTempus_Projects_Overview from '../../stubs/Tempus_Projects_Overview.json';
import testYouthInAction_Projects_Overview from '../../stubs/YouthInAction_Projects_Overview.json';

describe('DG EAC CSV transformer', () => {
  let CoopIndustrialisedCountries_Projects_Overview = {};
  let CreativeEurope_Projects_Overview = {};
  let Culture_2007_2013_Projects_Overview = {};
  let ErasmusMundus_Projects_Overview = {};
  let ErasmusPlus_JeanMonnet_Projects_Overview = {};
  let ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview = {};
  let ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview = {};
  let ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview = {};
  let ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview = {};
  let ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview = {};
  let ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview = {};
  let ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview = {};
  let ErasmusPlus_Sports_Projects_Overview = {};
  let LifeLongLearning_Projects_Overview = {};
  let Sports_Projects_Overview = {};
  let Tempus_Projects_Overview = {};
  let YouthInAction_Projects_Overview = {};

  beforeAll(() => {
    CoopIndustrialisedCountries_Projects_Overview = mapper(
      testCoopIndustrialisedCountries_Projects_Overview
    );
    CreativeEurope_Projects_Overview = mapper(
      testCreativeEurope_Projects_Overview
    );
    Culture_2007_2013_Projects_Overview = mapper(
      testCulture_2007_2013_Projects_Overview
    );
    ErasmusMundus_Projects_Overview = mapper(
      testErasmusMundus_Projects_Overview
    );
    ErasmusPlus_JeanMonnet_Projects_Overview = mapper(
      testErasmusPlus_JeanMonnet_Projects_Overview
    );
    ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview = mapper(
      testErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview
    );
    ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview = mapper(
      testErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview
    );
    ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview = mapper(
      testErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview
    );
    ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview = mapper(
      testErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview
    );
    ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview = mapper(
      testErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview
    );
    ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview = mapper(
      testErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview
    );
    ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview = mapper(
      testErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview
    );
    ErasmusPlus_Sports_Projects_Overview = mapper(
      testErasmusPlus_Sports_Projects_Overview
    );
    LifeLongLearning_Projects_Overview = mapper(
      testLifeLongLearning_Projects_Overview
    );
    Sports_Projects_Overview = mapper(testSports_Projects_Overview);
    Tempus_Projects_Overview = mapper(testTempus_Projects_Overview);
    YouthInAction_Projects_Overview = mapper(
      testYouthInAction_Projects_Overview
    );
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure for CoopIndustrialisedCountries_Projects_Overview', () => {
    expect(CoopIndustrialisedCountries_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for CoopIndustrialisedCountries_Projects_Overview do not contain decimals', () => {
    expect(
      CoopIndustrialisedCountries_Projects_Overview.budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      CoopIndustrialisedCountries_Projects_Overview.budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for CreativeEurope_Projects_Overview', () => {
    expect(CreativeEurope_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for CreativeEurope_Projects_Overview do not contain decimals', () => {
    expect(CreativeEurope_Projects_Overview.budget.eu_contrib.value % 1).toBe(
      0
    );
    expect(CreativeEurope_Projects_Overview.budget.total_cost.value % 1).toBe(
      0
    );
  });

  test('Produces correct JSON output structure for Culture_2007_2013_Projects_Overview', () => {
    expect(Culture_2007_2013_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for Culture_2007_2013_Projects_Overview do not contain decimals', () => {
    expect(
      Culture_2007_2013_Projects_Overview.budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      Culture_2007_2013_Projects_Overview.budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusMundus_Projects_Overview', () => {
    expect(ErasmusMundus_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for ErasmusMundus_Projects_Overview do not contain decimals', () => {
    expect(ErasmusMundus_Projects_Overview.budget.eu_contrib.value % 1).toBe(0);
    expect(ErasmusMundus_Projects_Overview.budget.total_cost.value % 1).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_JeanMonnet_Projects_Overview', () => {
    expect(ErasmusPlus_JeanMonnet_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_JeanMonnet_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_JeanMonnet_Projects_Overview.budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_JeanMonnet_Projects_Overview.budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA1_2014_LearningMobilityOfIndividuals_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA1_2015_LearningMobilityOfIndividuals_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA1_2016_LearningMobilityOfIndividuals_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA1_2017_LearningMobilityOfIndividuals_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA1_2018_LearningMobilityOfIndividuals_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview
        .budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA2_CooperationForInnovationAndTheExchangeOfGoodPractices_Projects_Overview
        .budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview', () => {
    expect(
      ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview
    ).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview.budget.eu_contrib
        .value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_KA3_SupportForPolicyReform_Projects_Overview.budget.total_cost
        .value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for ErasmusPlus_Sports_Projects_Overview', () => {
    expect(ErasmusPlus_Sports_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for ErasmusPlus_Sports_Projects_Overview do not contain decimals', () => {
    expect(
      ErasmusPlus_Sports_Projects_Overview.budget.eu_contrib.value % 1
    ).toBe(0);
    expect(
      ErasmusPlus_Sports_Projects_Overview.budget.total_cost.value % 1
    ).toBe(0);
  });

  test('Produces correct JSON output structure for LifeLongLearning_Projects_Overview', () => {
    expect(LifeLongLearning_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for LifeLongLearning_Projects_Overview do not contain decimals', () => {
    expect(LifeLongLearning_Projects_Overview.budget.eu_contrib.value % 1).toBe(
      0
    );
    expect(LifeLongLearning_Projects_Overview.budget.total_cost.value % 1).toBe(
      0
    );
  });

  test('Produces correct JSON output structure for Sports_Projects_Overview', () => {
    expect(Sports_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for Sports_Projects_Overview do not contain decimals', () => {
    expect(Sports_Projects_Overview.budget.eu_contrib.value % 1).toBe(0);
    expect(Sports_Projects_Overview.budget.total_cost.value % 1).toBe(0);
  });

  test('Produces correct JSON output structure for Tempus_Projects_Overview', () => {
    expect(Tempus_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for Tempus_Projects_Overview do not contain decimals', () => {
    expect(Tempus_Projects_Overview.budget.eu_contrib.value % 1).toBe(0);
    expect(Tempus_Projects_Overview.budget.total_cost.value % 1).toBe(0);
  });

  test('Produces correct JSON output structure for YouthInAction_Projects_Overview', () => {
    expect(YouthInAction_Projects_Overview).toMatchSnapshot();
  });

  test('Budget values for YouthInAction_Projects_Overview do not contain decimals', () => {
    expect(YouthInAction_Projects_Overview.budget.eu_contrib.value % 1).toBe(0);
    expect(YouthInAction_Projects_Overview.budget.total_cost.value % 1).toBe(0);
  });
});
