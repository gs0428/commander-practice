import { existsSync, promises as fs } from "fs";
import path from "path";
import { program, Command } from "commander";
import { getRegistry } from "./utils/registry.js";
import { execa } from "execa";

const add = new Command()
  .name("add")
  .description("add new component")
  .argument("<component>")
  .option("-c, --cwd [cwd]", "chose directory where you want to install. default is current working directory.", process.cwd())
  .action(async (component, option) => {
    const cwd = process.cwd();

    if (!existsSync(option.cwd)) throw new Error(`There is no '${cwd}'. Please check and try again.`);

    // 존재하는 컴포넌트라면 json 형식의 데이터를 반환
    // 존재하지 않는 컴포넌트라면 false를 반환
    const newComponent = await getRegistry(component);

    if (!newComponent) throw new Error(`There is no '${component}' component. Please check and retry.`);

    const { name, dependencies, devDependencies, files, type } = newComponent;
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

    if (dependencies?.length) {
      // execa 라이브러리를 이용하여
      // 해당 컴포넌트의 의존성 설치
      await execa("pnpm", ["add", ...dependencies], cwd);
    }

    if (devDependencies?.length) {
      // execa 라이브러리를 이용하여
      // 해당 컴포넌트의 의존성 설치
      await execa("pnpm", ["add", "-D", ...devDependencies], cwd);
    }
  });

program.addCommand(add).parse();
