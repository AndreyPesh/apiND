import { AppDataSource } from './data-source';

export const connectDB = async () => {
  const isConnected = await AppDataSource.initialize()
  if(isConnected) return true;
  return false;
};
