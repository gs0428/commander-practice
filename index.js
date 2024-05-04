import { add } from "./cli/commands/add.js";
import { init } from "./cli/commands/init.js";
import { Command } from "commander";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

function main() {
  const program = new Command().name("cli-practice").description("commander practice");

  program.addCommand(init).addCommand(add);

  program.parse();
}

main();
