import { Command } from "commander";
import { z } from "zod";
import fs from "fs-extra";
import path from "path";
import { findPanda } from "../utils/panda.js";

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

      // 설치하고자 하는 디렉토리 경로가 존재하는지 확인
      if (!fs.existsSync(cwd)) {
        console.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      // 판다 설치 여부 확인
      if (!findPanda()) {
        // 판다 설치 진행
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
