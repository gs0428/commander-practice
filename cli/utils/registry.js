export const getAllRegistries = async () => {
  try {
    const response = await fetch("https://ui.shadcn.com/registry/index.json");
    return response.json();
  } catch (error) {
    throw new Error("Something went wrong. Please check the network status.");
  }
};

export const getRegistries = async (components) => {
  try {
    const response = await Promise.all(
      components.map(async (component) => {
        const fetchedComponent = await fetch(`https://ui.shadcn.com/registry/styles/default/${component}.json`);
        return await fetchedComponent.json();
      })
    );
    return response;
  } catch (error) {
    throw new Error("Please check the components and try again.");
  }
};
