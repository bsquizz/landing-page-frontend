import axiosInstance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { getAnsibleDataSchema } from './ansible-api';
import { getCostDataSchema } from './cost-api';
import { getFifiDataSchema } from './fifi-api';
import { getPriorityDataSchema } from './priority-api';
import { createRhelSchema } from './rhel';

import { getManagedServicesDataSchema } from './managed-services-api';

async function getSchema(url, section) {
  try {
    let data = await axiosInstance.get(url);
    if (data?.estate?.items) {
      data.estate = [
        {
          section,
          items: data.estate.items,
        },
      ];
    } else {
      data.estate = [];
    }
    return data;
  } catch (error) {
    console.error(`Unable load schema from ${url}.`, error);
    return {
      estate: [],
      recommendations: {},
      configTryLearn: {},
    };
  }
}

const getAppsData = async (env) => {
  const data = await Promise.all([
    getPriorityDataSchema(),
    getManagedServicesDataSchema(),
    createRhelSchema(),
    getSchema(
      '/api/automation-hub/_ui/v1/landing-page/',
      'Ansible Automation Platform'
    ),
    getAnsibleDataSchema(),
    getFifiDataSchema(),
    getCostDataSchema(),
    getSchema('/api/ros/v1/call_to_action'),
    getSchema(
      `https://api${
        env === 'stage' ? '.stage' : ''
      }.openshift.com/api/accounts_mgmt/v1/landing_page/self_service`
    ),
  ]);
  return data;
};

export default getAppsData;
