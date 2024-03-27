import { program } from "commander";
import { getRegistry } from "./utils/registry.js";
import { Command } from "commander";

const add = new Command()
  .name("add")
  .description("add new component")
  .argument("[component]")
  .action(async (component) => {
    // 존재하는 컴포넌트라면 json 형식의 데이터를 반환
    // 존재하지 않는 컴포넌트라면 false를 반환
    const newComponent = await getRegistry(component);

    if (!newComponent) throw new Error(`There is no '${component}' component. Please check and retry.`);

    const { type } = newComponent;
  });

program.addCommand(add).parse();
