const treatDate = async (date) => {
    if (date === null | date === "" | date === undefined) {
        return "";
    } else {
        let output_date = new Date(date);
        output_date = `${output_date.getFullYear()}-${('0'+(output_date.getMonth()+1)).slice(-2)}-${('0'+output_date.getDate()).slice(-2)}T00:00:00Z`;
        return output_date;
    }
}

module.exports = {
    treatDate,
}