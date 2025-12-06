import dotenv from "dotenv";
import { connect } from "http2";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
};

export default envConfig;
