const oauth2Client = require("../../config/google.config");
const { google } = require("googleapis");
const { axiosHubspot } = require("../../config/axios.config");
const generalResponse = require("../../middlewares/general-response.middleware");
const {
  ORIGINAL_FILE_ID,
  PARENT_FOLDER_ID,
  DRIVE_ID,
} = require("../../config/env.config");
const { logger } = require("../../config/logger.config");

const createSlide = async (req, response) => {
  const webhookData = req.body;

  logger.verbose(
    JSON.stringify({
      objectType: webhookData.objectType,
      objectId: webhookData.objectId,
    })
  );
  if (webhookData.objectType !== "DEAL") {
    return generalResponse({
      response,
      message: `Invalid object type.`,
      toast: false,
      statusCode: 400,
      responseType: "error",
      data: null,
      dataKey: "data",
    });
  }

  try {
    const dealId = webhookData.objectId;
    const dealName = webhookData.properties?.dealname?.value;
    const slidesAPI = google.slides({
      version: "v1",
      auth: oauth2Client,
    });
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
    // function
    const createFolderAndGetId = async (displayName) => {
      const fileMetadata = {
        name: displayName || dealName || dealId,
        mimeType: "application/vnd.google-apps.folder",
        parents: [PARENT_FOLDER_ID],
      };

      const file = await drive.files.create({
        // auth: auth,
        resource: fileMetadata,
        fields: "id",
        supportsAllDrives: true,
        driveId: DRIVE_ID,
      });
      logger.verbose(`Folder ID: ${file.data.id}`);
      return file.data.id;
    };

    const searchObject = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "associations.deal",
              operator: "EQ",
              value: dealId,
            },
          ],
        },
      ],
    };
    let retailCompanyResponse = await axiosHubspot.post(
      "/crm/v3/objects/company/search",
      searchObject
    );

    const companyName =
      retailCompanyResponse?.data?.results[0]?.properties?.name;
    logger.verbose(`companyName is: ${companyName}`);
    const parentFolderId = await createFolderAndGetId(companyName);

    const fileMetadata = {
      name: "Company HubSpot Onboarding",
      parents: [parentFolderId],
      mimeType: "application/vnd.google-apps.presentation",
      fields: "*",
    };

    // Duplicate the file
    const { data: duplicate } = await drive.files.copy({
      fileId: ORIGINAL_FILE_ID,
      requestBody: fileMetadata,
      supportsAllDrives: true,
      driveId: DRIVE_ID,
    });

    if (duplicate.id) {
      const presentationId = duplicate?.id;

      const plans = webhookData?.properties?.hubspot_plan?.value.replace(
        /;/g,
        ", "
      );
      const goals = webhookData?.properties?.pso_initial_goals?.value.replace(
        /;/g,
        ", "
      );
      const description =
        webhookData?.properties?.customer_onboarding_specialist___description
          ?.value;
      const imageUrl =
        webhookData?.properties?.customer_onboarding_specialist___imgurl?.value?.trim();

      const payload = [
        {
          replace: "{{company_name}}",
          hubspotKey: companyName,
        },
        {
          replace: "{{customer_onboarding_specialist_description}}",
          hubspotKey: description,
        },
        {
          replace: "{{confirm_hubspot_plan}}",
          hubspotKey: plans,
        },
        {
          replace: "{{add_them_here}}",
          hubspotKey: goals,
        },
      ];
      let requests = [];

      requests = payload.map((el) => {
        return {
          replaceAllText: {
            replaceText: el.hubspotKey,
            containsText: {
              text: el.replace,
              matchCase: false,
            },
          },
        };
      });

      imageUrl
        ? requests.push({
            replaceImage: {
              imageObjectId: "p3_i167",
              imageReplaceMethod: "CENTER_INSIDE",
              url: imageUrl,
            },
          })
        : requests.push({
            replaceImage: {
              imageObjectId: "p3_i167",
              imageReplaceMethod: "CENTER_INSIDE",
              url: "https://www.crmtoolbox.io/hs-fs/hubfs/crm-toolbox/img/logo-crm-toolbox-avidly.png?width=1000&height=272&name=logo-crm-toolbox-avidly.png",
            },
          });

      const updatedSlide = await slidesAPI.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      });

      const { data } = await drive.files.get({
        fileId: presentationId,
        fields: "*",
        supportsAllDrives: true,
        driveId: DRIVE_ID,
      });
      console.log("data", data);
      const responseData = {
        fileId: data.id,
        url: data?.webViewLink,
        downloadUrl: data?.webContentLink,
      };

      logger.verbose(
        `new presentation id is ${updatedSlide?.data?.presentationId}`
      );
      console.log({ responseData });
      return generalResponse({
        response,
        message: `new presentation id is ${data}`,
        toast: false,
        statusCode: 200,
        responseType: "success",
        data: responseData,
        dataKey: "data",
      });
    } else {
      logger.verbose(
        "error in craete duplicate file because not got duplicate id"
      );
      return generalResponse({
        response,
        message: `Something went wrong.`,
        toast: false,
        statusCode: 500,
        responseType: "error",
        data: null,
        dataKey: "data",
      });
    }
  } catch (error) {
    logger.warn(JSON.stringify(error.message));
    return generalResponse({
      response,
      message: `Something went wrong. ${error.message}`,
      toast: false,
      statusCode: 500,
      responseType: "error",
      data: null,
      dataKey: "data",
    });
  }
};
module.exports = { createSlide };
