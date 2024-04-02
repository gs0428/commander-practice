import { existsSync, promises as fs } from "fs";
import path from "path";
import { program, Command } from "commander";
import { getAllRegistries, getRegistries } from "./utils/registry.js";
import { execa } from "execa";
import ora from "ora";
import { checkbox } from "@inquirer/prompts";

const add = new Command()
  .name("add")
  .description("add new component")
  .argument("[components...]")
  .option("-a, --all", "get all components", false)
  .option("-c, --cwd [cwd]", "chose directory where you want to install. default is current working directory.", process.cwd())
  .action(async (components, option) => {
    const cwd = process.cwd();

    if (!existsSync(option.cwd)) throw new Error(`There is no '${cwd}'. Please check and try again.`);

    const allRegistries = await getAllRegistries();

    let selectedComponents = option.all ? allRegistries.map((registry) => registry.name) : components;

    if (!components.length && !option.all) {
      const componentList = await checkbox({
        message: "select components",
        choices: allRegistries.map((registry) => ({ name: registry.name, value: registry.name })),
      });
      selectedComponents = componentList;
    }

    const fetchedComponents = await getRegistries(selectedComponents);

    const spinner = ora(`Installing...`).start();

    for (const fetchedComponent of fetchedComponents) {
      spinner.text = `Installing ${fetchedComponent.name}...`;
      const { name, dependencies, devDependencies, files, type } = fetchedComponent;
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
          console.log(`\n${name} is component already exist.`);
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
    }

    spinner.succeed("Done");
  });

program.addCommand(add).parse();
