import { generateAccessToken, setTokens } from '../middleware/generateToken.js';
import { getTenantModel } from '../model/getTenantModel.js';
import TenantUser from '../model/tenent.model.js';
import CounterUserSchema from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

export async function UserCreate(req, res) {
    try {
        const { fullName, username, email, password, counterNumber, mobile, role } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if tenant exists
        let tenantUser = await TenantUser.findOne({ email }) || await TenantUser.findOne({ mobile });

        if (!tenantUser) {
            // If tenant doesn't exist, create a new tenant
            const tenantId = new mongoose.Types.ObjectId().toString(); // Generate a new tenantId
            tenantUser = new TenantUser({
                email,
                mobile,
                tenantId:username+tenantId,
            });
            await tenantUser.save();
        }
        else {
            // If tenant exists, return error
            return res.status(400).json({ error: "User is already present, please use another account" });
        }
        const tenantId =tenantUser.tenantId;

        // Dynamically get the tenant-specific CounterUser model using the correct schema
        const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);

        // Check if user already exists
        const existingUser = await CounterUser.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email is already taken" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new CounterUser({
            fullName,
            username,
            email,
            tenantId,
            password: hashedPassword,
            counterNumber,
            mobile,
            role,
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobile: newUser.mobile,
            },
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function signup(req, res) {
    try {
        const { fullName, username, email, password, counterNumber, mobile,role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await CounterUser.findOne({ fullName });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await CounterUser.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new CounterUser({
            fullName,
            username,
            email,
            tenantId:tenantId,
            password: hashedPassword,
            counterNumber,
            mobile,
            role, 
        });

        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            mobile: newUser.mobile,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export async function login(req, res) {
    try {
        const { email, password } = req.body;
                // Step 1: Fetch tenantId from TenantUsers collection
                const tenantUser = await TenantUser.findOne({ email }) || await TenantUser.findOne({mobile: email });
                if (!tenantUser) {
                    return res.status(400).json({ error: 'Invalid email or tenant not found' });
                }
                const tenantId = tenantUser.tenantId;
                console.log(tenantUser);
           const CounterUser=await getTenantModel(tenantId, 'CounterUser', CounterUserSchema);
        const user = await CounterUser.findOne({ email }) || await CounterUser.findOne({mobile: email });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const { accessToken, refreshToken } = setTokens(user, res);

        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function logout(req, res) {
    try {
        res.cookie("accessToken", "", { maxAge: 0 });
        res.cookie("refreshToken", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export async function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(decoded.id);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log("Error in refresh controller", error.message);
        res.status(401).json({ error: "Invalid refresh token" });
    }
}

export async function getUsers(req, res) {
    try {
        const users = await CounterUser.find().select('-password'); // Exclude password field from query results

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Update Counter User
export async function updateUser(req, res) {
    const { id } = req.params;
    const { fullName, password, email, mobile, counterNumber } = req.body;

    try {
        // the existing user
        const existingUser = await CounterUser.findById(id);
        if (!existingUser) {
            return res.status(404).send({ message: "User not found", status: false });
        }

        let updateData = {};

        // We Update only the provided fields
        if (fullName !== undefined) updateData.fullName = fullName;
        if (email !== undefined) updateData.email = email;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (counterNumber !== undefined) updateData.counterNumber = counterNumber;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await CounterUser.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found", status: false });
        }

        return res.status(200).send({ message: "User updated successfully", status: true, data: updatedUser });
    } catch (error) {
        console.log("Error in updateUser controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Counter User
export async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const deletedUser = await CounterUser.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found", status: false });
        }

        return res.status(200).send({ message: "User deleted successfully", status: true, data: deletedUser });
    } catch (error) {
        console.log("Error in deleteUser controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
