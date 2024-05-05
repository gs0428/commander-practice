import fs from "fs-extra";
import path from "path";

import { Command } from "commander";
import { z } from "zod";
import { detect } from "detect-package-manager";

import { findPanda, initPanda } from "../utils/panda.js";

const initOptionsSchema = z.object({
  yes: z.boolean(),
  defaults: z.boolean(),
  cwd: z.string(),
});

export const init = new Command()
  .name("init")
  .description("init panda")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults,", "use default configuration.", false)
  .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", process.cwd())
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts);
      const cwd = path.resolve(options.cwd);
      const packageManager = await detect().then((res) => res);

      // 설치하고자 하는 디렉토리 경로가 존재하는지 확인
      if (!fs.existsSync(cwd)) {
        console.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      // 판다 설치 여부 확인
      if (!findPanda()) {
        // 설치되어 있지 않다면 판다 설치 진행
        initPanda(cwd, packageManager);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
