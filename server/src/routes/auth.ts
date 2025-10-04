// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi
// Project: notilificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

import bcrypt from "bcryptjs";
import express from "express";
import UserModel from "../db/models/User";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth";
import { NextFunction } from 'express';
import User from "../db/models/User";
import { sendEmail } from "../services/emailService";
import { JWT_SECRET } from '../config';

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

let refreshTokens: string[] = [];


/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if email already exists
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email address already exists" });
    }

    // Hash password before saving
    const user = new UserModel({ name, email, password });
    await user.save();
    
    //This sends a welcome email after finish signing up
    await sendEmail(
      user.email, "Welcome to Notificacion", `Hi ${user.name}, thanks for signing up!`, `<h1>Welcome, ${user.name}! </h1><p>Your account has been created successfully.</p>`
    );

    res.status(201).json({
      message: "New user registered successfully",
      userId: user._id,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role},
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  refreshTokens.push(refreshToken);
  return { accessToken, refreshToken };
};
/**
 * @route   POST /auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    //Finding the user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    //Checking if the password is a match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);
    return res.json({ token: accessToken, refreshToken, role: user.role, userId: user._id });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  jwt.verify(token, REFRESH_SECRET, (err: any, user:any) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ token: accessToken });
  });
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.json({ message: "Logged out" });
});

/**
 * @route   GET /auth/me
 * @desc    Get current logged-in user
 * @access  Private (requires token)
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user.id;
    const user = await UserModel.findById(uid).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
