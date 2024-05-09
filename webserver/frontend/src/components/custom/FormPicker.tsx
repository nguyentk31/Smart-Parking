import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { imageArea } from "@/utils/imageLocation";
import { ImageLocation } from "@/interfaces";

const FormPicker = () => {
  const [images, setImages] = useState<ImageLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setImages(imageArea);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image.url)}
            className="relative cursor-pointer aspect-video group hover:opacity-75 transition bg-muted"
          >
            {selectedImage === image.url && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            )}
            <img
              src={image.url}
              alt={image.description}
              className="object-cover rounded-sm w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPicker;
