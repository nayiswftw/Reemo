import { v4 as uuidv4 } from "uuid";

// Generates an 8-character unique invite code by removing hyphens from UUID
export const generateInviteCode = () => uuidv4().replace(/-/g, "").slice(0, 8);

// Creates a task code with 'task-' prefix followed by 3 unique characters
export const generateTaskCode = () => `task-${uuidv4().replace(/-/g, "").slice(0, 3)}`;
