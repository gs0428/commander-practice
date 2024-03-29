export const getRegistry = async (name) => {
  const response = await fetch(`https://ui.shadcn.com/registry/styles/default/${name}.json`);
  if (response.status === 404) return null;

  return response.json();
};
