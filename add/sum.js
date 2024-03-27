import { program } from "commander";

program.name("Sum process").description("Input two numbers you want to sum").option("-a <a>").option("-b <b>");

program.parse();

const options = program.opts();

const { a: num1, b: num2 } = options;

export const sum = (a, b) => {
  if (typeof a === "string" || typeof b === "string") throw new Error(`a or b must be "number"`);

  return Number(a) + Number(b);
};

console.log(sum(num1, num2));
