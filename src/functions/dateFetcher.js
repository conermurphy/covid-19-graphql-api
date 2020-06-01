const dateFetcher = () => {
  try {
    let day;
    let month;
    if (new Date().getDate() - 1 !== 0) {
      day = (new Date().getDate() - 1).toString().length === 1 ? `0${new Date().getDate() - 1}` : new Date().getDate() - 1;
      month = new Date().getMonth().toString().length === 1 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1;
    } else {
      day = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
      month = new Date().getMonth().toString().length === 1 ? `0${new Date().getMonth()}` : new Date().getMonth();
      console.log(day, month);
    }
    const year = new Date().getFullYear();
    const fullDate = `${month}-${day}-${year}`;
    return fullDate;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export default dateFetcher;
