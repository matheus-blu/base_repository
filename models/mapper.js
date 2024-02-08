const fs = require('fs');
const json2csv = require('json2csv').parse;


const mapSchema = async(jsonPath) => {
    const schema = {};
    // Sample data
    const data = JSON.parse(fs.readFileSync(jsonPath));

    data.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (!schema[key]) {
                schema[key] = new Set();
            }

            // If the value is an object, recursively map its schema
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                const subSchema = mapSchema([obj[key]]);
                Object.keys(subSchema).forEach(subKey => {
                    if (!schema[`${key}.${subKey}`]) {
                        schema[`${key}.${subKey}`] = new Set();
                    }
                    subSchema[subKey].forEach(value => {
                        schema[`${key}.${subKey}`].add(value);
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

const mapJsonArray = async() => {
    // Generate schema
    const schema = mapSchema(jsonData);

    // Write schema to a JSON file
    fs.writeFile('schema.json', JSON.stringify(schema, null, 2), err => {
        if (err) {
            console.error('Error writing schema file:', err);
        } else {
            console.log('Schema file has been saved.');
        }
    });

    const csvData = json2csv(schema);

    // Write CSV data to file
    fs.writeFile('schema.csv', csvData, err => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log('CSV file has been saved.');
        }
    });
};

module.exports = {
    mapJsonArray,
}