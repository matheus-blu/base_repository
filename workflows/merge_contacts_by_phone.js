const axios = require("axios");
const HS_KEY = process.env.WORKFLOW_API_KEY;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// SEARCH RECORD
const searchRecord = async (filters) => {
  const config = {
    method: 'post',
    url: `https://api.hubapi.com/crm/v3/objects/contacts/search`,
    headers: {
      'authorization': `Bearer ${HS_KEY}`,
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      "properties": [
        "hs_object_id",
        "salesforcecontactid",
        "email",
        "hs_email_domain",
        "phone",
        "firstname",
        "lastname"
      ],
      "filterGroups": [{
          "filters": filters
        }]
    })
  };
  const response = await axios.request(config);
  return response.data.results;
}

const mergeContacts = async (primary_id, to_merge_id) => {
  const config = {
    method: 'post',
    url: `https://api.hubapi.com/crm/v3/objects/contacts/merge`,
    headers: {
      'authorization': `Bearer ${HS_KEY}`,
      'content-type': 'application/json'
    },
    data: {
      "objectIdToMerge": to_merge_id,
      "primaryObjectId": primary_id
    }
  }
  console.log(config.data)
  const response  = await axios.request(config);
  return response.data;
}

exports.main = async (event, callback) => {
  /*****
    Use inputs to get data from any action in your workflow and use it in your code instead of having to use the HubSpot API.
  *****/
  const email = event.inputFields['email'];
  const hs_email_domain = event.inputFields['hs_email_domain'];
  const salesforcecontactid = event.inputFields['salesforcecontactid'];
  const phone = event.inputFields['phone'];
  const firstname = event.inputFields['firstname'];
  const lastname = event.inputFields['lastname'];
  
  try {
    var rand = Math.floor(Math.random() * 3000);
    const phone_search = await searchRecord([{
                "propertyName": "phone",
                "value": phone,
                "operator": "EQ"
              },
              {
                "propertyName": "firstname",
                "value": firstname,
                "operator": "EQ"
              },
              {
                "propertyName": "lastname",
                "value": lastname,
                "operator": "EQ"
              }])
    try {
      // MERGE BASED ON PHONE NUMBER
      if (phone_search.length >= 2) {
        let primary_record;
        let objects_to_merge = [];
        for (const record of phone_search) {
          if (record.properties.salesforcecontactid && !primary_record) {
            primary_record = record.id;
          } else if (record.properties.salesforcecontactid && primary_record) {
            console.log("More then one Contact synced to SFDC");
          } else if (!record.properties.salesforcecontactid) {
            objects_to_merge.push(record.id);
          }
          await delay (2000+rand);
        }
        if (!primary_record) {
          await mergeContacts(objects_to_merge[0],objects_to_merge[1]);
        } else {
          for (const to_merge of objects_to_merge) {
            await mergeContacts(primary_record, to_merge);
            await delay(2000+rand);
          }
        }
        console.log(`Primary: ${primary_record}`);
        console.log(`To Merge: ${objects_to_merge}`);
		} 
    } catch (e) {
      console.log(`Error merging Contacts: ${e}`);
    }
  } catch (e) {
    console.log(`Error searching Contacts: ${e}`);
  }
  


  /*****
    Use the callback function to output data that can be used in later actions in your workflow.
  *****/
  callback({
    outputFields: {
      //email: email
    }
  });
}