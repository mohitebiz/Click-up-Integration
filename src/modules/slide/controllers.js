const oauth2Client = require("../../config/google.config");
const { google } = require("googleapis");
const { axiosHubspot } = require("../../config/axios.config");
const generalResponse = require("../../middlewares/general-response.middleware");
const { ORIGINAL_FILE_ID } = require("../../config/env.config");
const { logger } = require("../../config/logger.config");

const createSlide = async (req, response) => {
  const webhookData = req.body;
  try {
    const slidesAPI = google.slides({
      version: "v1",
      auth: oauth2Client,
    });
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
    const createFolderAndGetId = async (diplayName) => {
      const fileMetadata = {
        name: diplayName || "crmtoolbox",
        mimeType: "application/vnd.google-apps.folder",
        parents: ["1Rf0ki43qoQukyRScYBfTccmUNqm1ZdAf"],
      };

      const file = await drive.files.create({
        // auth: auth,
        resource: fileMetadata,
        fields: "id",
      });
      logger.verbose(`Folder ID: ${file.data.id}`);
      return file.data.id;
    };

    const { data } = await drive.files.get({
      fileId: ORIGINAL_FILE_ID,
      fields: "*",
    });
    const dealId = webhookData.objectId;

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

    const companyName = retailCompanyResponse.data.results[0].properties.name;
    logger.verbose(`companyName is: ${companyName}`);
    const parentFolderId = await createFolderAndGetId(companyName);

    const fileId = data.id;
    const fileMetadata = {
      name: data.name,
      parents: [parentFolderId],
      mimeType: "application/vnd.google-apps.presentation",
      fields: "*",
    };

    // Duplicate the file
    const { data: duplicate } = await drive.files.copy({
      fileId,
      requestBody: fileMetadata,
    });

    if (duplicate.id) {
      const presentationId = duplicate.id;

      const plans = webhookData.properties.hubspot_plan.value.replace(
        /;/g,
        ", "
      );
      const goals = webhookData.properties.pso_initial_goals.value.replace(
        /;/g,
        ", "
      );
      const description =
        webhookData.properties.customer_onboarding_specialist___description
          .value;
      const imageUrl =
        webhookData.properties.customer_onboarding_specialist___imgurl.value;

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

      requests.push({
        replaceImage: {
          imageObjectId: "p3_i432",
          imageReplaceMethod: "CENTER_INSIDE",
          url: imageUrl,
        },
      });

      const updatedSlide = await slidesAPI.presentations.batchUpdate({
        presentationId,
        resource: {
          requests,
        },
      });
      logger.verbose(
        `new presentation id is ${updatedSlide?.data?.presentationId}`
      );
      return generalResponse({
        response,
        message: `new presentation id is ${updatedSlide?.data?.presentationId}`,
        toast: false,
        statusCode: 200,
        responseType: "success",
      });
    } else {
      logger.verbose(
        "error in craete duplicate file because not got duplicate id"
      );
    }
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};
module.exports = { createSlide };
