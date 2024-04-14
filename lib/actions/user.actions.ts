"user server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDB } from "../db";
import User from "../db/models/user.model";
import Event from "../db/models/event.mode";
import { revalidatePath } from "next/cache";
import Order from "../db/models/order.mode";

export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDB();
    const newUser = await User.create(user);
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};
export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDB();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDB();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
};
