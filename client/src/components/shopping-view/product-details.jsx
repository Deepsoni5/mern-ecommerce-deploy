import { Check, ChevronDown, StarIcon, X } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  addToCart,
  fetchCartItems,
  fetchGuestCartDetails,
} from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import YouTube from "react-youtube";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { productList, rateProductList } = useSelector(
    (state) => state.shopProducts
  );
  const [selectedImage, setSelectedImage] = useState(
    Array.isArray(productDetails?.image) && productDetails.image.length > 0
      ? productDetails.image[0] // Set last image as default
      : productDetails?.image
  );

  const [showVideo, setShowVideo] = useState(false);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (
      Array.isArray(productDetails?.image) &&
      productDetails.image.length > 0
    ) {
      setSelectedImage(productDetails.image[0]);
    }
  }, [productDetails]);

  useEffect(() => {
    if (!open && searchParams.get("product")) {
      // Reset URL to the current page
      navigate(location.pathname);
    }
  }, [open, searchParams, navigate, location.pathname]);

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const handleClose = (e) => {
    if (e.target.id === "video-overlay") {
      setShowVideo(false);
    }
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const [selectedModels, setSelectedModels] = useState({});
  const models = productDetails?.models || [];

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

  function handleAddToCart(getCurrentProductId) {
    const currentProduct = productList.find(
      (product) => product._id === getCurrentProductId
    );

    if (!currentProduct) {
      toast({ title: "Product not found in stock!", variant: "destructive" });
      return;
    }

    const productSelectedModels = Array.isArray(
      selectedModels[getCurrentProductId]
    )
      ? selectedModels[getCurrentProductId]
      : [];

    if (currentProduct.models && currentProduct.models.length > 0) {
      if (productSelectedModels.length === 0) {
        toast({
          title: "Please select a model first!",
          variant: "destructive",
        });
        return;
      }
    }

    const totalStock = currentProduct.totalStock;
    const quantity =
      productSelectedModels.length > 0 ? productSelectedModels.length : 1;

    if (!isAuthenticated) {
      // ✅ Guest User - Store in localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = cart.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (existingIndex !== -1) {
        let existingItem = cart[existingIndex];

        // ✅ Merge new models while keeping track of quantity
        productSelectedModels.forEach((model) => {
          let existingModel = existingItem.selectedModels.find(
            (m) => m.modelName === model
          );
          if (existingModel) {
            existingModel.quantity += 1; // ✅ Increase quantity for the existing model
          } else {
            existingItem.selectedModels.push({ modelName: model, quantity: 1 });
          }
        });

        existingItem.quantity = existingItem.selectedModels.reduce(
          (sum, model) => sum + model.quantity,
          0
        );

        if (existingItem.quantity > totalStock) {
          toast({
            title: `Only ${totalStock} quantity available for this item`,
            variant: "destructive",
          });
          return;
        }
      } else {
        cart.push({
          productId: getCurrentProductId,
          quantity,
          selectedModels: productSelectedModels.map((model) => ({
            modelName: model,
            quantity: 1,
          })),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast({ title: "Product added to cart" });
      dispatch(fetchGuestCartDetails(cart));
    } else {
      // ✅ Logged-in User - Update via API
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity,
          selectedModels: productSelectedModels.map((modelName) => ({
            modelName: modelName,
            quantity: 1, // ✅ Ensure quantity is properly sent
          })),
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product added to cart" });
        } else if (data?.payload?.error === "out_of_stock") {
          toast({
            title: `Only ${totalStock} quantity available for this item`,
            variant: "destructive",
          });
        }
      });
    }
  }
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!user) {
      toast({
        title: "You must be logged in to add a review!",
        variant: "destructive",
      });
      setRating(0);
      setReviewMsg("");
      return;
    }
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast({
            title: payload.message || "Review added successfully!",
          });
        } else {
          toast({
            title: payload.message || "An error occurred!",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
      });
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-white p-4 sm:p-6 md:p-8 lg:p-12 max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto ">
        <DialogClose asChild>
          <button className="absolute -top-1 right-1 text-red-600 hover:text-red-800 text-3xl sm:hidden">
            <X className="w-8 h-8" />
          </button>
        </DialogClose>

        <div className=" mt-4 sm:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt={productDetails?.title}
                width={600}
                height={600}
                className="aspect-square rounded-2xl w-full object-cover"
              />
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {Array.isArray(productDetails?.image) &&
                productDetails.image.slice(0, 5).map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover cursor-pointer rounded-md border ${
                        img === selectedImage
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />

                    {/* Show Play Icon on Last Image If Video Exists */}
                    {index === productDetails.image.length - 1 &&
                      productDetails.videoUrl && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md cursor-pointer"
                          onClick={() => setShowVideo(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="white"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.752 11.168l-5.197-3.016A1 1 0 008 8.02v7.96a1 1 0 001.555.832l5.197-3.016a1 1 0 000-1.664z"
                            />
                          </svg>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-3 mt-2 sm:mb-5 sm:mt-4">
                {productDetails?.description}
              </p>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                {models.length > 0 && "Select Model:"}
              </label>

              {models.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-gray-800 shadow-sm"
                      type="button"
                    >
                      {selectedModels[productDetails._id]?.length > 0
                        ? selectedModels[productDetails._id].join(", ")
                        : "Select Model"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-2 bg-white rounded-md shadow-lg z-50"
                    sideOffset={5}
                  >
                    {models.map((model, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                          selectedModels[productDetails._id]?.includes(model)
                            ? "font-semibold text-blue-600"
                            : "text-gray-700"
                        }`}
                        onClick={() =>
                          toggleModelSelection(productDetails._id, model)
                        }
                        style={{ pointerEvents: "auto" }}
                        role="button"
                        tabIndex={0}
                      >
                        {selectedModels[productDetails._id]?.includes(
                          model
                        ) && <Check className="w-4 h-4 mr-2 text-blue-600" />}
                        {model}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-xl sm:text-2xl md:text-3xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                ₹{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 ? (
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-muted-foreground">
                  ₹{productDetails?.salePrice}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div>
            <div className="mt-4 mb-4 sm:mt-5 sm:mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full rounded-xl"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
            <Separator className="bg-gray-300" />
            <div className="mt-4">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Reviews
              </h2>
              <div className="overflow-y-auto h-[40vh] md:h-[50vh] lg:h-[60vh] pr-2">
                <div className="grid gap-4 sm:gap-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem) => (
                      <div className="flex gap-2 sm:gap-4" key={reviewItem._id}>
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border flex-shrink-0">
                          <AvatarFallback>
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">
                              {reviewItem?.userName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent
                              rating={reviewItem?.reviewValue}
                            />
                          </div>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>No Reviews</h1>
                  )}
                </div>
                <div className="mt-6 sm:mt-8">
                  <Label>Write a review</Label>
                  <div className="flex gap-1 mt-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    className="mt-2"
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                  />
                  <Button
                    className="mt-2 w-full"
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {showVideo && productDetails.videoUrl && (
            <div
              id="video-overlay"
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
              onClick={handleClose}
            >
              <div className="relative w-[90%] max-w-xl bg-black p-4 rounded-lg">
                <button
                  className="absolute -top-4 -right-4 text-white text-3xl"
                  onClick={() => setShowVideo(false)}
                >
                  &times;
                </button>

                {/* Responsive YouTube Player */}
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <YouTube
                    videoId={productDetails.videoUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: { autoplay: 1 },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
