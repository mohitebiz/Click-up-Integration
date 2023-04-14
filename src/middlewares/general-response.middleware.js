const generalResponse = ({
  response,
  message = null,
  toast = false,
  statusCode = 200,
  responseType = "success",
  data = undefined,
  dataKey = "options",
}) => {
  response.status(statusCode).send({
    [dataKey]: data,
    message: message,
    toast: toast,
    responseType: responseType,
  });
};

module.exports = generalResponse;
