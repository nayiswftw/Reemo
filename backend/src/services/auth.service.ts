import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

// THIS TOOK SO LONG TO FIGURE OUT
// !!!AUGH! THE COMPLETE LOGIC FOR AUTH SERVICE!!!
// DO NOT TOUCH THIS FILE. 

export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { providerId, provider, displayName, email, picture } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Started Session...");

        // Check if user already exists
        let user = await UserModel.findOne({ email }).session(session);

        if (!user) {
            // Create new user if not found
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            // Create new account for the user
            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });

            // Create a new workspace for the user
            const workspace = new WorkspaceModel({
                name: `My Workspace`,
                description: `Workspace created for ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            // Find the owner role
            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }).session(session);

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }

            // Add user as a member of the workspace with owner role
            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });

            // Set the current workspace for the user
            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        console.log("End Session...");

        return { user };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
};

export const registerUserService = async (body: {
    email: string;
    name: string;
    password: string;
}) => {
    const { email, name, password } = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email }).session(session);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        // Create new user
        const user = new UserModel({
            email,
            name,
            password,
        });
        await user.save({ session });

        // Create new account for the user
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email,
        });
        await account.save({ session });

        // Create a new workspace for the user
        const workspace = new WorkspaceModel({
            name: `My Workspace`,
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        });
        await workspace.save({ session });

        // Find the owner role
        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        }).session(session);

        if (!ownerRole) {
            throw new NotFoundException("Owner role not found");
        }

        // Add user as a member of the workspace with owner role
        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        await member.save({ session });

        // Set the current workspace for the user
        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();
        console.log("End Session...");

        return {
            userId: user._id,
            workspaceId: workspace._id,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        throw error;
    }
};

export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL,
}: {
    email: string;
    password: string;
    provider?: string;
}) => {
    // Find account by provider and providerId (email)
    const account = await AccountModel.findOne({ provider, providerId: email });
    if (!account) {
        throw new NotFoundException("Invalid email or password");
    }

    // Find user by account's userId
    const user = await UserModel.findById(account.userId);

    if (!user) {
        throw new NotFoundException("User not found for the given account");
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
    }

    return user.omitPassword();
};

export const findUserByIdService = async (userId: string) => {
    const user = await UserModel.findById(userId, {
        password: false,
    });
    return user || null;
}