import { getTenantModel } from '../database/getTenantModel.js';
import CounterUserSchema from '../model/user.model.js';
import bcrypt from 'bcryptjs';

// Utility function for error handling
const handleErrorResponse = (res, error, message = "Internal server error", status = 500) => {
  console.error(error);
  return res.status(status).send({ message, status: false, error: error.message });
};

// Create Counter User
export const createUser = async (req, res) => {
  const { fullName, password, email, mobile, counterNumber } = req.body;

  if (!fullName || !password || !email || !mobile) {
    return res.status(400).send({ message: "Full name, password, email, and mobile are required", status: false });
  }

  try {
    const tenantId =req.user.tenantId
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new CounterUser({ fullName, password: hashedPassword, email, mobile, counterNumber });

    const savedUser = await user.save();
    return res.status(201).send({ message: "User created successfully", status: true, data: savedUser });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// View Single Counter User
export const viewUser = async (req, res) => {
  const { id } = req.params;

  try {
    const tenantId =req.user.tenantId
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
    const user = await CounterUser.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found", status: false });
    }

    return res.status(200).send({ message: "User retrieved successfully", status: true, data: user });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// Update Counter User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, password, email, mobile, counterNumber } = req.body;
  
    try {
      // Retrieve the existing user
      const tenantId =req.user.tenantId
      const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
      const existingUser = await CounterUser.findById(id);
      if (!existingUser) {
        return res.status(404).send({ message: "User not found", status: false });
      }
  
      // Prepare update data
      let updateData = {};
  
      // Update only the provided fields
      if (fullName !== undefined) updateData.fullName = fullName;
      if (email !== undefined) updateData.email = email;
      if (mobile !== undefined) updateData.mobile = mobile;
      if (counterNumber !== undefined) updateData.counterNumber = counterNumber;
  
      // Handle password update separately
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      // Perform the update
      const updatedUser = await CounterUser.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedUser) {
        return res.status(404).send({ message: "User not found", status: false });
      }
  
      return res.status(200).send({ message: "User updated successfully", status: true, data: updatedUser });
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };

// Delete Counter User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const tenantId =req.user.tenantId
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
    const deletedUser = await CounterUser.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found", status: false });
    }

    return res.status(200).send({ message: "User deleted successfully", status: true, data: deletedUser });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

// View All Counter Users
export const viewUsers = async (req, res) => {
  try {
    const tenantId =req.user.tenantId
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
    const users = await CounterUser.find();
    return res.status(200).send({ message: "Users retrieved successfully", status: true, data: users });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
