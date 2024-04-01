export const getAllRegistries = async () => {
  try {
    const response = await fetch("https://ui.shadcn.com/registry/index.json");
    return response.json();
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};
