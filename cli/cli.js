import { existsSync, promises as fs } from "fs";
import path from "path";
import { program } from "commander";
import { getRegistry } from "./utils/registry.js";
import { Command } from "commander";

const add = new Command()
  .name("add")
  .description("add new component")
  .argument("[component]")
  .action(async (component) => {
    const cwd = process.cwd();

    // 존재하는 컴포넌트라면 json 형식의 데이터를 반환
    // 존재하지 않는 컴포넌트라면 false를 반환
    const newComponent = await getRegistry(component);

    if (!newComponent) throw new Error(`There is no '${component}' component. Please check and retry.`);

    const { name, files, type } = newComponent;
    const [parentFolder, childFolder] = type.split(":");
    const targetDir = path.resolve(cwd, parentFolder, childFolder);

    if (!existsSync(targetDir)) {
      // targetDir이 존재하지 않는다면
      // 상위 디렉토리와 함께 폴더 생성
      // { recursive: true }가 상위 디렉토리를 생성 해줌
      await fs.mkdir(targetDir, { recursive: true });
    }

    for (const file of files) {
      const filePath = path.resolve(targetDir, file.name);

      if (existsSync(filePath)) {
        console.log(`${name} is component already exist.`);
        continue;
      }

      await fs.writeFile(filePath, file.content);
    }
  });

program.addCommand(add).parse();
