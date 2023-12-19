const { google } = require("googleapis");
const { axiosHubspot } = require("../../config/axios.config");
const generalResponse = require("../../middlewares/general-response.middleware");
const {
  ORIGINAL_FILE_ID,
  PARENT_FOLDER_ID,
  DRIVE_ID,
} = require("../../config/env.config");
let tokenCreads = require("../../constant/token-2661178.json");
let tokenCreadsAvidly = require("../../constant/token-308131.json");

const { logger } = require("../../config/logger.config");
const { slideCredentials } = require("../../constant/slide.constant");
let oauth2Client,
  { initOAuth2Client } = require("../../config/google.config");

const createSlide = async (req, response) => {
  const webhookData = req.body;

  let portal = req.body.portalId;

  // response.redirect(`/google?token=${token}`);
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

  let oAuthFun;
  switch (portal) {
    case 2661178:
      oAuthFun = await initOAuth2Client(portal, tokenCreads);
      break;

    case 308131:
      oAuthFun = await initOAuth2Client(portal, tokenCreadsAvidly);
      break;
  }

  try {
    const dealId = webhookData.objectId;
    const dealName = webhookData.properties?.dealname?.value;
    const slidesAPI = google.slides({
      version: "v1",
      auth: oAuthFun,
    });
    const drive = google.drive({
      version: "v3",
      auth: oAuthFun,
    });
    // function
    const createFolderAndGetId = async (displayName) => {
      const fileMetadata = {
        name: displayName || dealName || dealId,
        mimeType: "application/vnd.google-apps.folder",
        parents: [slideCredentials[portal].PARENT_FOLDER_ID],
      };

      const file = await drive.files.create({
        // auth: auth,
        resource: fileMetadata,
        fields: "id",
        supportsAllDrives: true,
        driveId: slideCredentials[portal].DRIVE_ID,
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
      searchObject,
      { portalId: portal }
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
      fileId: slideCredentials[portal].ORIGINAL_FILE_ID,
      requestBody: fileMetadata,
      supportsAllDrives: true,
      driveId: slideCredentials[portal].DRIVE_ID,
    });

    logger.info(`Portal for the slide create ${portal}`);
    switch (portal) {
      case 2661178:
        if (duplicate.id) {
          const presentationId = duplicate?.id;

          const plans = webhookData?.properties?.hubspot_plan?.value.replace(
            /;/g,
            ", "
          );
          const goals =
            webhookData?.properties?.pso_initial_goals?.value.replace(
              /;/g,
              ", "
            );
          const description =
            webhookData?.properties
              ?.customer_onboarding_specialist___description?.value;
          const imageUrl =
            webhookData?.properties?.customer_onboarding_specialist___imgurl
              ?.value;

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
            driveId: slideCredentials[portal].DRIVE_ID,
          });

          const responseData = {
            fileId: data.id,
            url: data?.webViewLink,
            downloadUrl: data?.webContentLink,
          };

          logger.verbose(
            `new presentation id is ${updatedSlide?.data?.presentationId}`
          );

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
            "error in Create duplicate file because not got duplicate id"
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

      case 308131:
        if (duplicate.id) {
          const presentationId = duplicate?.id;

          const plans = webhookData?.properties?.hubspot_plan?.value.replace(
            /;/g,
            ", "
          );
          const goals =
            webhookData?.properties?.pso_initial_goals?.value.replace(
              /;/g,
              ", "
            );
          const description =
            webhookData?.properties
              ?.customer_onboarding_specialist___description?.value;
          const imageUrl =
            webhookData?.properties?.customer_onboarding_specialist___imgurl
              ?.value;

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
            driveId: slideCredentials[portal].DRIVE_ID,
          });

          const responseData = {
            fileId: data.id,
            url: data?.webViewLink,
            downloadUrl: data?.webContentLink,
          };

          logger.verbose(
            `new presentation id is ${updatedSlide?.data?.presentationId}`
          );
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
            "error in Create duplicate file because not got duplicate id"
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
    }
  } catch (error) {
    console.log(error);
    logger.warn(JSON.stringify(error));
    return generalResponse({
      response,
      message: `Something went wrong. + ${error}`,
      toast: false,
      statusCode: 500,
      responseType: "error",
      data: null,
      dataKey: "data",
    });
  }
};
module.exports = { createSlide };
