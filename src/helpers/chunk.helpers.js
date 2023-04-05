const splitIntoChunk = async (arr, chunk) => {
  const mainArray = [];
  for (i = 0; i < arr.length; i += chunk) {
    let tempArray;
    tempArray = arr.slice(i, i + chunk);
    mainArray.push(tempArray);
  }
  return mainArray;
};

module.exports = { splitIntoChunk };
