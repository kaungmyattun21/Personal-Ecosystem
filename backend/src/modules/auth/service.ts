import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import * as repo from "./repository.js";
import { AppError } from "../../shared/utils/AppError.js";
import { seedDefaultCategories } from "./seedCategories.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "15m";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  authProvider?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function createTokens(userId: string, email: string) {
  const accessToken = jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId, email }, env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existedEmail = await repo.findByEmail(input.email);
  if (existedEmail) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await repo.createUser({
    email: input.email,
    name: input.name ?? null,
    passwordHash,
    authProvider: "LOCAL",
  });

  await seedDefaultCategories(user.id);

  const { accessToken, refreshToken } = createTokens(user.id, user.email);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

  await repo.updateUser(user.id, { refreshToken: hashedRefreshToken });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await repo.findByEmail(input.email);
  if (!user?.passwordHash) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = createTokens(user.id, user.email);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

  await repo.updateUser(user.id, { refreshToken: hashedRefreshToken });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
    },
    accessToken,
    refreshToken,
  };
}

export async function oauthLogin(input: {
  email: string;
  name?: string;
  imageUrl?: string;
}): Promise<AuthResponse> {
  let user = await repo.findByEmail(input.email);

  if (!user) {
    user = await repo.createUser({
      email: input.email,
      name: input.name ?? null,
      image: input.imageUrl ?? null,
      authProvider: "GOOGLE",
    });

    await seedDefaultCategories(user.id);
  }

  const { accessToken, refreshToken } = createTokens(user.id, user.email);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

  await repo.updateUser(user.id, { refreshToken: hashedRefreshToken });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      authProvider: user.authProvider,
    },
    accessToken,
    refreshToken,
  };
}

export async function refresh(
  inputRefreshToken: string,
): Promise<AuthResponse> {
  let decoded: { userId: string; email: string };
  try {
    decoded = jwt.verify(inputRefreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
      email: string;
    };
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await repo.findById(decoded.userId);
  if (!user || !user.refreshToken) {
    throw new AppError("Invalid or revoked refresh token", 401);
  }

  const valid = await bcrypt.compare(inputRefreshToken, user.refreshToken);
  if (!valid) {
    throw new AppError("Invalid or revoked refresh token", 401);
  }

  const { accessToken, refreshToken } = createTokens(user.id, user.email);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);

  await repo.updateUser(user.id, { refreshToken: hashedRefreshToken });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      authProvider: user.authProvider,
    },
    accessToken,
    refreshToken,
  };
}

export async function getMe(userId: string): Promise<AuthUser | null> {
  const user = await repo.findById(userId);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    authProvider: user.authProvider,
  };
}
