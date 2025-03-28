import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    setImageFile((prevFiles) => {
      const safePrevFiles = Array.isArray(prevFiles) ? prevFiles : []; // ✅ Fallback to empty array
      return [...safePrevFiles, ...selectedFiles].slice(0, 5);
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);

    if (droppedFiles.length > 0) {
      setImageFile((prevFiles) => [...prevFiles, ...droppedFiles].slice(0, 5));
    }
  }

  function handleRemoveImage(index) {
    const updatedImages = [...imageFile];
    updatedImages.splice(index, 1);
    setImageFile(updatedImages);
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);

    const uploadedUrls = new Array(imageFile.length); // Maintain correct order

    const uploadPromises = imageFile.map(async (file, index) => {
      const data = new FormData();
      data.append("my_file", file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
          data
        );

        if (response?.data?.success) {
          uploadedUrls[index] = response.data.result[0]; // Maintain order
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    });

    await Promise.all(uploadPromises); // Wait for all uploads

    setUploadedImageUrl([...uploadedUrls]); // Ensure state update with correct order
    setImageLoadingState(false);
  }

  useEffect(() => {
    if (imageFile?.length > 0) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <label className="text-lg font-semibold mb-2 block">Upload Image</label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={` border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onInput={handleImageFileChange}
          multiple
          accept="image/*"
        />

        {!imageFile?.length ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & Drop or Click to upload images</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-300" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {imageFile.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <Button
                  className="absolute top-0 right-0 p-1"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
