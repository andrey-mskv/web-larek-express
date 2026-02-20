import dontenv from "dotenv";

dontenv.config();

export const { DB_ADDRESS, PORT } = process.env;

interface IConfig {
  dbAddress: string;
  port: number;
}

function getEnv(name: string, required = true): string {
  const value = process.env[name];

  if (!value && required) {
    throw new Error(`Environment variable ${name} is required but not defined`);
  }

  return value as string;
}

export const config: IConfig = {
  dbAddress: getEnv('DB_ADDRESS'),
  port: Number(getEnv('PORT')),
};