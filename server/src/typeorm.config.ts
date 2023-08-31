import { DataSource } from "typeorm"
import CONNECTION from "./db.connection";
import { join } from "path";

// @ts-ignore
export const AppDataSource = new DataSource({
  ...CONNECTION,
  migrations: ["src/migrations/*.ts"],

})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })
