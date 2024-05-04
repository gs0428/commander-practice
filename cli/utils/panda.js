import path from "path";
import fs from "fs-extra";

export const findPanda = () => {
  const packagePath = path.join("package.json");
  const panda = fs.readJSONSync(packagePath);
  const { dependencies } = panda;
  const isPandaExist = Object.keys(dependencies).findIndex((key) => key === "@pandacss/dev");

  if (isPandaExist < 0) return false;

  return true;
};
