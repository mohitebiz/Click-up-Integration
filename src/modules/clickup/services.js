const { axiosClickUp } = require("../../config/axios.config");
const { logger } = require("../../config/logger.config");
const getworkSpaceData = async (portalId) => {
  try {
    const resworkspaces = await axiosClickUp.get("/api/v2/team", {
      portalId: portalId,
    });

    const workSpaceData = resworkspaces.data.teams;
    // const responseArray = [];
    const responseArray = [];
    for (obj of workSpaceData) {
      responseArray.push({
        label: obj.name,
        value: obj.id,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};

const getspaceData = async (workSpaceId, portalId) => {
  try {
    const resspaces = await axiosClickUp.get(
      `/api/v2/team/${workSpaceId}/space`,
      {
        portalId: portalId,
      }
    );
    const spaceData = resspaces.data.spaces;
    const responseArray = [];
    for (obj of spaceData) {
      responseArray.push({
        label: obj.name,
        value: obj.id,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};

const getStatusData = async (spaceId, portalId) => {
  try {
    const resspace = await axiosClickUp.get(`/api/v2/space/${spaceId}`, {
      portalId: portalId,
    });
    const statusData = resspace.data?.statuses;
    const responseArray = [];
    for (obj of statusData) {
      responseArray.push({
        label: obj.status,
        value: obj.status,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};

const getFolderData = async (spaceId, portalId) => {
  try {
    const resfolders = await axiosClickUp.get(
      `/api/v2/space/${spaceId}/folder`,
      {
        portalId: portalId,
      }
    );
    const folderData = resfolders.data.folders;
    const responseArray = [];
    for (obj of folderData) {
      responseArray.push({
        label: obj.name,
        value: obj.id,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};
const getListData = async (folderId) => {
  try {
    const resListData = await axiosClickUp.get(
      `/api/v2/folder/${folderId}/list`,
      {
        portalId: portalId,
      }
    );
    const listData = resListData.data.lists;
    const responseArray = [];
    for (obj of listData) {
      responseArray.push({
        label: obj.name,
        value: obj.id,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};

const getUserData = async (listId) => {
  try {
    const resUserData = await axiosClickUp.get(
      `/api/v2/list/${listId}/member`,
      {
        portalId: portalId,
      }
    );
    const listData = resUserData.data.members;
    const responseArray = [];
    for (obj of listData) {
      responseArray.push({
        label: obj.username,
        description: obj.email,
        value: obj.id,
      });
    }

    return responseArray;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};

const createTask = async (fetchedData, portalId) => {
  try {
    payload = {
      name: fetchedData?.taskName,
      description: fetchedData?.taskDescription,
      assignees: fetchedData?.users,
      due_date: fetchedData?.dueDate,
      start_date: fetchedData?.startDate,
      status: fetchedData?.status,
      priority: fetchedData?.priority,
      time_estimate: fetchedData?.estimateTime * 3600000,
    };
    const resListData = await axiosClickUp.post(
      `/api/v2/list/${fetchedData?.listInputs}/task`,
      {
        portalId: portalId,
      },
      payload
    );
    return resListData.data;
  } catch (error) {
    logger.warn(JSON.stringify(error));
    return false;
  }
};
module.exports = {
  getworkSpaceData,
  getspaceData,
  getFolderData,
  getListData,
  getUserData,
  createTask,
  getStatusData,
};
