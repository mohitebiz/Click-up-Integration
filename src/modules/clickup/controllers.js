// const { response } = require("express");
const { logger } = require("../../config/logger.config");
const generalResponse = require("../../middlewares/general-response.middleware");
const {
  getworkSpaceData,
  getspaceData,
  getFolderData,
  getListData,
  getUserData,
  createTask,
  getStatusData,
} = require("./services");

const workSpaceData = async (request, response, next) => {
  try {
    const { portalId } = request.body;
    const allWorkSpaceData = await getworkSpaceData(portalId);
    if (allWorkSpaceData) {
      logger.verbose("workspaces Fetched successfully");
      return generalResponse({
        response: response,
        data: allWorkSpaceData,
        message: "fetched all WorkSpace",
      });
    } else {
      logger.warn("error while fetch workspaces");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching work spaces",
      });
    }
  } catch (error) {
    next(error);
  }
};
const spacesData = async (request, response, next) => {
  try {
    const { portalId } = request.body;
    const workSpaceId = request.query.workSpaceId;
    const allspaceData = await getspaceData(workSpaceId, portalId);
    if (allspaceData) {
      logger.verbose("spaces Fetched successfully");
      return generalResponse({
        response: response,
        data: allspaceData,
        message: "fetched all sapces",
      });
    } else {
      logger.warn("error while fetch spaces");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching spaces",
      });
    }
  } catch (error) {
    next(error);
  }
};
const statusData = async (request, response, next) => {
  try {
    const { portalId } = request.body;

    const spaceId = request.query.spaceId;
    const allStatusData = await getStatusData(spaceId, portalId);
    if (allStatusData) {
      logger.verbose("status Fetched successfully");
      return generalResponse({
        response: response,
        data: allStatusData,
        message: "fetched all status",
      });
    } else {
      logger.warn("error while fetch status");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching status",
      });
    }
  } catch (error) {
    next(error);
  }
};
const folderData = async (request, response, next) => {
  try {
    const { portalId } = request.body;

    const spaceId = request.query.spaceId;
    const allFolderData = await getFolderData(spaceId, portalId);
    if (allFolderData) {
      logger.verbose("folders Fetched successfully");
      return generalResponse({
        response: response,
        data: allFolderData,
        message: "fetched all Folders",
      });
    } else {
      logger.warn("error while fetch folders");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching folders",
      });
    }
  } catch (error) {
    next(error);
  }
};
const listData = async (request, response, next) => {
  try {
    const { portalId } = request.body;

    const folderId = request.query.folderId;
    const allListData = await getListData(folderId, portalId);
    if (allListData) {
      logger.verbose("lists Fetched successfully");
      return generalResponse({
        response: response,
        data: allListData,
        message: "fetched all Lists",
      });
    } else {
      logger.warn("error while fetch lists");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching lists",
      });
    }
  } catch (error) {
    next(error);
  }
};
const userData = async (request, response, next) => {
  try {
    const { portalId } = request.body;

    const listId = request.query.listId;
    const allUsers = await getUserData(listId, portalId);
    if (allUsers) {
      logger.verbose("Users Fetched successfully");
      return generalResponse({
        response: response,
        data: allUsers,
        message: "fetched all Users",
      });
    } else {
      logger.warn("error while fetch users");
      return generalResponse({
        response: response,
        data: [],
        statusCode: 500,
        responseType: "error",
        message: "error while fetching users",
      });
    }
  } catch (error) {
    next(error);
  }
};

const taskData = async (request, response, next) => {
  try {
    const { portalId } = request.body;

    logger.verbose(JSON.stringify(request.body));
    const fetchedData = request.body.fields;
    const createdTask = await createTask(fetchedData, portalId);
    if (createdTask) {
      logger.verbose(`Task created successfully at id ${createdTask.id}`);
      return generalResponse({
        response: response,
        message: `Task created successfully at id ${createdTask.id}`,
      });
    } else {
      logger.warn("error while creating task");
      return generalResponse({
        response: response,
        statusCode: 500,
        responseType: "error",
        message: "error while creting task",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  workSpaceData,
  spacesData,
  folderData,
  listData,
  taskData,
  userData,
  statusData,
};
