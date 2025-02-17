import mongoose from "mongoose";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError";
import { TaskStatusEnum } from "../enums/task.enum";

// Creates a new project in a workspace
export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }), // Conditionally add emoji if provided
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();
  return { project };
};

// Retrieves paginated projects for a workspace
export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  // Get total count for pagination
  const [totalCount, projects] = await Promise.all([
    ProjectModel.countDocuments({ workspace: workspaceId }),
    ProjectModel.find({ workspace: workspaceId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("createdBy", "_id name profilePicture -password")
      .sort({ createdAt: -1 })
  ]);

  return {
    projects,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    skip: (pageNumber - 1) * pageSize
  };
};

// Fetches a specific project by ID within a workspace
export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  return { project };
};

// Retrieves analytics data for a project
export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project?.workspace.equals(workspaceId)) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  // Aggregate task statistics in a single query
  const [analytics] = await TaskModel.aggregate([
    {
      $match: { project: new mongoose.Types.ObjectId(projectId) }
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: new Date() },
              status: { $ne: TaskStatusEnum.DONE },
            }
          },
          { $count: "count" }
        ],
        completedTasks: [
          { $match: { status: TaskStatusEnum.DONE } },
          { $count: "count" }
        ],
      }
    }
  ]);

  return {
    analytics: {
      totalTasks: analytics.totalTasks[0]?.count || 0,
      overdueTasks: analytics.overdueTasks[0]?.count || 0,
      completedTasks: analytics.completedTasks[0]?.count || 0,
    }
  };
};

// Updates project details
export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, workspace: workspaceId },
    { $set: body },
    { new: true }
  );

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  return { project };
};

// Deletes a project and its associated tasks
export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  // Use Promise.all for parallel execution
  await Promise.all([
    project.deleteOne(),
    TaskModel.deleteMany({ project: project._id })
  ]);

  return project;
};
