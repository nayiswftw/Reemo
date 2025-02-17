import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

// Creates a new task in a workspace project
export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  // Verify project exists and belongs to workspace
  const project = await ProjectModel.findOne({ 
    _id: projectId, 
    workspace: workspaceId 
  });
  if (!project) {
    throw new NotFoundException("Project not found or does not belong to this workspace");
  }

  // Verify assigned user is workspace member
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });
    if (!isAssignedUserMember) {
      throw new BadRequestException("Assigned user is not a member of this workspace");
    }
  }

  // Create and save new task
  const task = await TaskModel.create({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  return { task };
};

// Updates an existing task
export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  // Verify project and task exist and belong to workspace
  const [project, task] = await Promise.all([
    ProjectModel.findOne({ _id: projectId, workspace: workspaceId }),
    TaskModel.findOne({ _id: taskId, project: projectId })
  ]);

  if (!project) {
    throw new NotFoundException("Project not found or does not belong to this workspace");
  }
  if (!task) {
    throw new NotFoundException("Task not found or does not belong to this project");
  }

  // Update task with new data
  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    body,
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updatedTask };
};

// Retrieves filtered tasks with pagination
export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  // Build query based on filters
  const query: Record<string, any> = { workspace: workspaceId };
  if (filters.projectId) query.project = filters.projectId;
  if (filters.status?.length) query.status = { $in: filters.status };
  if (filters.priority?.length) query.priority = { $in: filters.priority };
  if (filters.assignedTo?.length) query.assignedTo = { $in: filters.assignedTo };
  if (filters.keyword) query.title = { $regex: filters.keyword, $options: "i" };
  if (filters.dueDate) query.dueDate = { $eq: new Date(filters.dueDate) };

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  // Execute query with pagination
  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name"),
    TaskModel.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      skip,
    },
  };
};

// Retrieves a specific task by ID
export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found");
  }

  return task;
};

// Deletes a task from workspace
export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException("Task not found or does not belong to the workspace");
  }
};
