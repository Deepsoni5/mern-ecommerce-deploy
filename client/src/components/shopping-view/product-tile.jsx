import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaShareNodes, FaWhatsapp, FaInstagram, FaCopy } from "react-icons/fa6";
import { FaSms } from "react-icons/fa";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  selectedModels,
  setSelectedModels,
}) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { toast } = useToast();
  const productLink = `${
    import.meta.env.VITE_API_CLIENT_URL
  }/shop/home?product=${product._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productLink);
    toast({
      title: "Link copied!",
      description: "The product link has been copied to your clipboard.",
    });
  };

  const models = product?.models || [];

  const toggleModelSelection = (productId, model) => {
    setSelectedModels((prevSelected) => {
      const currentSelection = prevSelected[productId] || []; // Get models for this product

      return {
        ...prevSelected,
        [productId]: currentSelection.includes(model)
          ? currentSelection.filter((m) => m !== model) // Remove if already selected
          : [...currentSelection, model], // Add if not selected
      };
    });
  };

  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer rounded-xl shadow-lg border-none p-3 relative">
      <button
        className="absolute top-1 -right-1 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
        onClick={() => setShowShareOptions(!showShareOptions)}
      >
        <FaShareNodes size={18} className="text-gray-700" />
      </button>

      {/* Share Options Dialog */}
      {showShareOptions && (
        <div className="absolute top-12 right-3 bg-white shadow-lg rounded-xl p-4 z-50 w-48 border border-gray-200">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Share this product
          </h3>
          <div className="flex flex-col space-y-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                productLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-2 rounded-md transition bg-green-50 hover:bg-green-100"
            >
              <FaWhatsapp size={18} className="text-green-600" />
              <span className="text-gray-700">WhatsApp</span>
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(
                productLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-2 rounded-md transition bg-pink-50 hover:bg-pink-100"
            >
              <FaInstagram size={18} className="text-pink-600" />
              <span className="text-gray-700">Instagram</span>
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(productLink)}`}
              className="flex items-center space-x-3 p-2 rounded-md transition bg-blue-50 hover:bg-blue-100"
            >
              <FaSms size={18} className="text-blue-600" />
              <span className="text-gray-700">Messages</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-3 p-2 rounded-md transition bg-gray-100 hover:bg-gray-200"
            >
              <FaCopy size={18} className="text-gray-600" />
              <span className="text-gray-700">Copy Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Image & Stock Status */}
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="mt-4 relative h-60 overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-contain object-center transition-transform duration-300 ease-in-out hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>

        {/* Product Details */}
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2 text-muted-foreground text-[16px]">
            <span>{product?.category}</span>
            <span>{product?.brand}</span>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              {models.length > 0 && "Select Model:"}
            </label>

            {models.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-gray-800 shadow-sm"
                    onClick={(e) => e.stopPropagation()} // Prevents click from bubbling up
                  >
                    {selectedModels[product._id]?.length > 0
                      ? selectedModels[product._id].join(", ")
                      : "Select Model"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-2 bg-white rounded-md shadow-lg"
                  onClick={(e) => e.stopPropagation()} // Prevents dialog from closing
                >
                  {models.map((model, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                        selectedModels[product._id]?.includes(model)
                          ? "font-semibold text-blue-600"
                          : "text-gray-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModelSelection(product._id, model);
                      }}
                    >
                      {selectedModels[product._id]?.includes(model) && (
                        <Check className="w-4 h-4 mr-2 text-blue-600" />
                      )}
                      {model}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Add to Cart Button */}
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() =>
              handleAddtoCart(product?._id, selectedModels, product?.totalStock)
            }
            className="w-full rounded-lg"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
