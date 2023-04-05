const generalResponse = ({
  response,
  message = null,
  toast = false,
  statusCode = 200,
  responseType = "success",
  data = undefined,
}) => {
  response.status(statusCode).send({
    options: data,
    message: message,
    toast: toast,
    responseType: responseType,
  });
};

module.exports = generalResponse;
