const axios = require('axios');
require("dotenv").config();
const HS_API_TOKEN = process.env.HS_TEST_HEY;

// SEARCH RECORD
const searchRecord = async (object_id, search_property, search_property_value) => {
  const config = {
    method: 'post',
    url: `https://api.hubapi.com/crm/v3/objects/${object_id}/search`,
    headers: {
      'authorization': `Bearer ${HS_API_TOKEN}`,
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      "properties": [
        "hs_object_id"
      ],
      "filterGroups": [{
          "filters": [{
              "propertyName": search_property,
              "value": search_property_value,
              "operator": "EQ"
            }]
        }]
    })
  };
  const response = await axios.request(config);
  return response.data.results;
}

// CREATE RECORD
const createRecord = async (object_id, properties, associations) => {
  const config = {
    method: 'post',
    url: `https://api.hubapi.com/crm/v3/objects/${object_id}`,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${HS_API_TOKEN}`,
    },
    data: {
      "properties": properties,
      "associations":associations
    }
  };
  const response = await axios.request(config);
  return response.data;
}

const updateRecord = async (object_id, record_id, properties, associations) => {
  const config = {
    method: 'patch',
    url: `https://api.hubapi.com/crm/v3/objects/${object_id}/${record_id}`,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${HS_API_TOKEN}`,
    },
    data: {
      "properties": properties,
      "associations":associations
    }
  };
  const response = await axios.request(config);
  return response.data;
}

const logNote = async (note_data, associations) => {
  const config = {
      method: 'post',
      url: 'https://api.hubapi.com/crm/v3/objects/notes',
      headers: {
          'authorization': `Bearer ${HS_API_TOKEN}`,
          'content-type': 'application/json'
      },
      data: {
          "associations": associations,
          "properties": {
              "hs_note_body": note_data.body,
              "hs_timestamp": note_data.create_date,
          }
      }
  }
  const response = await axios.request(config);
  return response;
}

module.exports = {
  searchRecord,
  createRecord,
  updateRecord,
  logNote
}
