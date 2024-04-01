export const getAllRegistries = async () => {
  const response = await fetch("https://ui.shadcn.com/registry/index.json");
  return response.json();
};

export const getRegistry = async (name) => {
  const response = await fetch(`https://ui.shadcn.com/registry/styles/default/${name}.json`);
  if (response.status === 404) return null;

  return response.json();
};
