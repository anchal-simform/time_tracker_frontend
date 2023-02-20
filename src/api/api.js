import axiosClient from '../utils/axiosClient';

export const login = (values) => {
  return axiosClient.post(`/auth/login`, values);
};

export const createEntry = (payload) => {
  return axiosClient.post(
    `/projects/${payload.project}/task/${payload.task}/time-logs`,
    payload
  );
};

export const updateEntry = (payload) => {
  return axiosClient.put(
    `/projects/${payload.project}/task/${payload.task}/time-logs`,
    payload
  );
};

export const getTimeLogEntry = async (timeLogId) => {
  return axiosClient.get(`/time-logs/${timeLogId}`);
};

export const getUserTimeLogs = async () => {
  return axiosClient.get('/time-logs/by-user');
};

export const updateTimeLogStatus = async (payload) => {
  return axiosClient.put(`/time-logs/${payload.timeLogId}`, payload);
};

export const getAllProjects = () => {
  return axiosClient.get(`/projects`);
};

export const getAllTasks = () => {
  return axiosClient.get(`/tasks`);
};

export const getTasksByProjectId = (projectId) => {
  return axiosClient.get(`/projects/${projectId}/tasks`);
};

export const getTimeLogsByRange = (queryParams) => {
  return axiosClient.get(`/time-logs?${queryParams}`);
};

export const getTimeLogsByProjectId = (projectId) => {
  return axiosClient.get(`/time-logs/projects/${projectId}/time-logs`);
};

export const getTimeLogsByTaskId = (taskId) => {
  return axiosClient.get(`/time-logs/tasks/${taskId}/time-logs`);
};

export const getPendingLogs = () => {
  return axiosClient.get(`/time-logs/pending-logs`);
};

export const getUpdatedLogs = () => {
  return axiosClient.get(`/time-logs/updated-logs`);
};
