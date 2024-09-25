export const processQuestion = async question => {
  return await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question })
  });
}