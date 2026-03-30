const generateImage = async () => {
  try {
    const output = [
      "https://picsum.photos/400/400",
    ];

    return output;
  } catch (error) {
    console.log("AI ERROR:", error);
    throw error;
  }
};

module.exports = generateImage;