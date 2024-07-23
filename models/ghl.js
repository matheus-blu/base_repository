const axios = require("axios");
const fs = require("fs");
require("dotenv").config({path: "./.env"});

const listOpportunities = async (url) => {
    const config = {
        method: 'get',
        url: url,
        headers: {
            Authorization: `Bearer ${process.env.GHL_KEY}`
        }
    }
    const response = await axios.request(config);
    return response.data;
}

const listAllOpportunities = async () => {
    const pipeline_list = ["ntjSRTmdUisRjivYSRns", "nM1ONzHcUkOmoeGJciq1", "QsTfBJYjRKDAYPYRzxIA"] // UPDATE
    let opportunities = [];
    for (const pipeline_id of pipeline_list){
        let url = `https://rest.gohighlevel.com/v1/pipelines/${pipeline_id}/opportunities?limit=100`
        while (url !== null) {
            opp_response = await listOpportunities(url);
            for (record of opp_response.opportunities) {
                opportunities.push(record);
            }
            url = opp_response.meta.nextPageUrl;
            console.log(opp_response)
        }
    }
    console.log(opportunities.length)
    fs.writeFileSync('opportunities.json', JSON.stringify(opportunities)); // SAVE OPPORTUNITIES JSON FILE
    return opportunities;
}

const listContacts = async (url) => {
    const config = {
        method: 'get',
        url: url,
        headers: { 
          'Authorization': `Bearer ${process.env.GHL_KEY}`
        }
    };
    const response = await axios.request(config);
    return response.data;
}

const listAllContacts = async () => {
    let contacts = [];
    let url = `https://rest.gohighlevel.com/v1/contacts/`
    while (url !== null) {
        const contacts_response = await listContacts(url);
        for (record of contacts_response.contacts) {
            contacts.push(record);
        }
        url = contacts_response.meta.nextPageUrl;
        console.log(contacts_response);
    }
    console.log(contacts.length)
    fs.writeFileSync('contacts.json', JSON.stringify(contacts));// SAVE CONTACTS JSON FILE
    return contacts;
}

module.exports = {
    listOpportunities,
    listAllOpportunities,
    listContacts,
    listAllContacts
}