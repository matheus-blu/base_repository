const fs = require('fs');
const json2csv = require('json2csv').parse;


const mapSchema = async(data) => {
    const schema = {};
    
    data.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (!schema[key]) {
                schema[key] = new Set();
            }

            // If the value is an object, recursively map its schema
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                const subSchema = mapSchema([obj[key]]);
                Object.keys(subSchema).forEach(sub_key => {
                    if (!schema[`${key}.${sub_key}`]) {
                        schema[`${key}.${sub_key}`] = new Set();
                    }
                    subSchema[sub_key].forEach(value => {
                        schema[`${key}.${sub_key}`].add(value);
                    });
                });
            } else {
                schema[key].add(obj[key]);
            }
        });
    });

    // Convert sets to arrays
    Object.keys(schema).forEach(key => {
        schema[key] = Array.from(schema[key]);
    });

    // Replace list of values with datatype if more than 100 values
    Object.keys(schema).forEach(key => {
        const values = Array.from(schema[key]);
        if (values.length > 100) {
            schema[key] = ['openfield'];
        } else {
            schema[key] = values;
        }
    });

    return schema;
}

const convertToHSMapping = async (json_schema) => {
    hs_mapping = [];
    Object.keys(json_schema).forEach(key => {
        hs_mapping.push({
            "Origin System Field Name": key,
            "Origin System Field Type": "",
            "HubSpot Object": "",
            "HubSpot Property Label": key,
            "HubSpot Property Internal Name": key.toLocaleLowerCase().replace(" ", "_"),
            "HubSpot Field Options": json_schema[key],
            "HubSpot Field Type": "",
            "HubSpot Type": "",
            "Group name": "",
            "Has Unique Value": "",
            "Technical Notes": "",
            "Property Status": "Pending"
        })
    })
    const csv_data = json2csv(hs_mapping);
    // Write CSV data to file
    fs.writeFile('hs_mapping.csv', csv_data, err => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log('CSV file has been saved.');
        }
    });
}

const mapJsonArray = async(json_data) => {
    // Generate schema
    const schema = await mapSchema(json_data);

    // Write schema to a JSON file
    fs.writeFile('schema.json', JSON.stringify(schema, null, 2), err => {
        if (err) {
            console.error('Error writing schema file:', err);
        } else {
            console.log('Schema file has been saved.');
        }
    });

    const csv_data = json2csv(schema);

    // Write CSV data to file
    fs.writeFile('schema.csv', csv_data, err => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log('CSV file has been saved.');
        }
    });

    await convertToHSMapping(schema);
};

module.exports = {
    mapJsonArray,
}