// CONVERT DATE TO MF FORMAT
const treatDate = async (date) => {
    if (date === null | date === "" | date === undefined) {
      return "";
    } else {
      console.log(date);
      let output_date = new Date(parseInt(date));
      console.log(output_date);
      return output_date;
    }
}

const main = async () => {
    await treatDate("1703894400000");
}

main();