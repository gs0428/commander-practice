import path from "path";
import fs from "fs-extra";
import ora from "ora";

import { execa } from "execa";

export const findPanda = () => {
  const packagePath = path.join("package.json");
  const panda = fs.readJSONSync(packagePath);
  const { dependencies } = panda;
  const isPandaExist = Object.keys(dependencies).findIndex((key) => key === "@pandacss/dev");

  if (isPandaExist < 0) return false;

  return true;
};

export const initPanda = async (cwd, packageManager) => {
  console.log("No panda exist. Start installing panda");
  try {
    // 판다 설치 커맨드 실행
    const installSpinner = ora("Installing panda...\n").start();
    await execa(packageManager, [packageManager === "npm" ? "install" : "add", "-D", "@pandacss/dev"], cwd);
    installSpinner.succeed("Success install panda");

    const initSpinner = ora("Initing postcss...\n").start();
    await execa(packageManager, ["panda", "init", "--postcss"], cwd);
    initSpinner.succeed("Success init postcss");
  } catch (err) {
    console.error("Something went wrong!");
    console.error(err);
  }
};
