import * as jwt from "jsonwebtoken";
import * as config from "../config/env.config";

export const createToken = (userId: number, type: string) => {
  try {
    const accessTokenPayload = { userId: userId };
    const refreshTokenPayload = { userId: userId };
    if (type === "access") {
      const accessToken = jwt.sign(
        accessTokenPayload,
        config.authConfig().ACCESS_JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: config.authConfig().ACCESS_JWT_EXPIRATION,
          issuer: config.authConfig().JWT_ISSUER,
        }
      );
      return accessToken;
    } else if (type === "refresh") {
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        config.authConfig().REFRESH_JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: config.authConfig().REFRESH_JWT_EXPIRATION,
          issuer: config.authConfig().JWT_ISSUER,
        }
      );

      return refreshToken;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAllToken = (userId: number) => {
  try {
    const accessTokenPayload = { userId: userId };
    const refreshTokenPayload = { userId: userId };

    const accessToken = jwt.sign(
      accessTokenPayload,
      config.authConfig().ACCESS_JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: config.authConfig().ACCESS_JWT_EXPIRATION,
        issuer: config.authConfig().JWT_ISSUER,
      }
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      config.authConfig().REFRESH_JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: config.authConfig().REFRESH_JWT_EXPIRATION,
        issuer: config.authConfig().JWT_ISSUER,
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verify = async (jwtString: string, secret: string) => {
  try {
    const payload = jwt.verify(jwtString, secret, {
      algorithms: ["HS256"],
    }) as jwt.JwtPayload;
    const { userId } = payload;

    return userId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
