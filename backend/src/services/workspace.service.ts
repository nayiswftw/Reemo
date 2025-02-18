import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.model";

// Creates a new workspace and assigns the creator as owner
export const createWorkspaceService = async (
  userId: string,
  { name, description }: { name: string; description?: string }
) => {
  const [user, ownerRole] = await Promise.all([
    UserModel.findById(userId),
    RoleModel.findOne({ name: Roles.OWNER })
  ]);

  if (!user) throw new NotFoundException("User not found");
  if (!ownerRole) throw new NotFoundException("Owner role not found");

  const workspace = await WorkspaceModel.create({
    name,
    description,
    owner: user._id,
  });

  await Promise.all([
    MemberModel.create({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    }),
    UserModel.findByIdAndUpdate(userId, { currentWorkspace: workspace._id })
  ]);

  return { workspace };
};

// Retrieves all workspaces where the user is a member
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .lean();

  return { workspaces: memberships.map(m => m.workspaceId) };
};

// Gets workspace details including its members
export const getWorkspaceByIdService = async (workspaceId: string) => {
  const [workspace, members] = await Promise.all([
    WorkspaceModel.findById(workspaceId),
    MemberModel.find({ workspaceId }).populate("role")
  ]);

  if (!workspace) throw new NotFoundException("Workspace not found");

  return { workspace: { ...workspace.toObject(), members } };
};

// Retrieves workspace members and available roles
export const getWorkspaceMembersService = async (workspaceId: string) => {
  const [members, roles] = await Promise.all([
    MemberModel.find({ workspaceId })
      .populate("userId", "name email profilePicture -password")
      .populate("role", "name"),
    RoleModel.find({}, { name: 1, _id: 1 }).select("-permission").lean()
  ]);

  return { members, roles };
};

// Calculates workspace analytics (tasks statistics)
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();
  const [totalTasks, overdueTasks, completedTasks] = await Promise.all([
    TaskModel.countDocuments({ workspace: workspaceId }),
    TaskModel.countDocuments({
      workspace: workspaceId,
      dueDate: { $lt: currentDate },
      status: { $ne: TaskStatusEnum.DONE },
    }),
    TaskModel.countDocuments({
      workspace: workspaceId,
      status: TaskStatusEnum.DONE,
    })
  ]);

  return { analytics: { totalTasks, overdueTasks, completedTasks } };
};

// Updates a member's role in the workspace
export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const [workspace, role, member] = await Promise.all([
    WorkspaceModel.findById(workspaceId),
    RoleModel.findById(roleId),
    MemberModel.findOne({ userId: memberId, workspaceId })
  ]);

  if (!workspace) throw new NotFoundException("Workspace not found");
  if (!role) throw new NotFoundException("Role not found");
  if (!member) throw new Error("Member not found in the workspace");

  member.role = role;
  await member.save();

  return { member };
};

// Updates workspace details
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await WorkspaceModel.findByIdAndUpdate(
    workspaceId,
    { $set: { name, description } },
    { new: true }
  );

  if (!workspace) throw new NotFoundException("Workspace not found");
  return { workspace };
};

// Deletes workspace and all related data
export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [workspace, user] = await Promise.all([
      WorkspaceModel.findById(workspaceId).session(session),
      UserModel.findById(userId).session(session)
    ]);

    if (!workspace) throw new NotFoundException("Workspace not found");
    if (!user) throw new NotFoundException("User not found");
    if (workspace.owner.toString() !== userId) {
      throw new BadRequestException("Not authorized to delete workspace");
    }

    await Promise.all([
      ProjectModel.deleteMany({ workspace: workspace._id }).session(session),
      TaskModel.deleteMany({ workspace: workspace._id }).session(session),
      MemberModel.deleteMany({ workspaceId: workspace._id }).session(session)
    ]);

    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(session);
      user.currentWorkspace = memberWorkspace?.workspaceId || null;
      await user.save({ session });
    }

    await workspace.deleteOne({ session });
    await session.commitTransaction();
    
    return { currentWorkspace: user.currentWorkspace };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
