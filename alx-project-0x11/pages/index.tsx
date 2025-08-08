import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!resp.ok) {
        console.error("Image generation failed");
        setIsLoading(false);
        return;
      }

      const data = await resp.json();
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setGeneratedImages((prev) => [
          { imageUrl: data.imageUrl, prompt },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Image Generation App</h1>
        <p className="text-lg text-gray-700 mb-4">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleGenerateImage}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Generate Image"}
          </button>
        </div>

        {/* Display last generated image */}
        {imageUrl && (
          <div className="mt-6">
            <ImageCard
              action={() => setImageUrl(imageUrl)}
              imageUrl={imageUrl}
              prompt={prompt}
            />
          </div>
        )}

        {/* Display history of generated images */}
        {generatedImages.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {generatedImages.map((img, index) => (
              <ImageCard
                key={index}
                action={() => setImageUrl(img.imageUrl)}
                imageUrl={img.imageUrl}
                prompt={img.prompt}
                width="small"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
