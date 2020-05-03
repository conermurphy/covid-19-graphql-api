const dateFetcher = () => {
  try {
    const day = (new Date().getDate() - 1).toString().length === 1 ? `0${new Date().getDate() - 1}` : new Date().getDate() - 1;
    const month = `0${new Date().getMonth() + 1}`;
    const year = new Date().getFullYear();
    const fullDate = `${month}-${day}-${year}`;
    return fullDate;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export default dateFetcher;
