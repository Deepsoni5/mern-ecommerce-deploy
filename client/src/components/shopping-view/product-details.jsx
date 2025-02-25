import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
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

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { productList, rateProductList } = useSelector(
    (state) => state.shopProducts
  );

  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // function handleAddToCart(getCurrentProductId, getTotalStock) {
  //   let getCartItems = cartItems.items || [];

  //   if (getCartItems.length) {
  //     const indexOfCurrentItem = getCartItems.findIndex(
  //       (item) => item.productId === getCurrentProductId
  //     );
  //     if (indexOfCurrentItem > -1) {
  //       const getQuantity = getCartItems[indexOfCurrentItem].quantity;

  //       if (getQuantity + 1 > getTotalStock) {
  //         toast({
  //           title: `Only ${getQuantity} quantity can be added for this item`,
  //           variant: "destructive",
  //         });

  //         return;
  //       }
  //     }
  //   }
  //   dispatch(
  //     addToCart({
  //       userId: user?.id,
  //       productId: getCurrentProductId,
  //       quantity: 1,
  //     })
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(fetchCartItems(user?.id));
  //       toast({
  //         title: "Product is added to cart",
  //       });
  //     }
  //   });
  // }

  function handleAddToCart(getCurrentProductId) {
    // ✅ Find the product in productList to get its stock
    const currentProduct = productList.find(
      (product) => product._id === getCurrentProductId
    );

    if (!currentProduct) {
      toast({
        title: "Product not found in stock!",
        variant: "destructive",
      });
      return;
    }

    // ✅ Get total stock available for the product
    const totalStock = currentProduct.totalStock;

    if (!isAuthenticated) {
      // Guest User - Store in localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = cart.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (existingIndex !== -1) {
        if (cart[existingIndex].quantity >= totalStock) {
          toast({
            title: `Only ${totalStock} quantity available for this item`,
            variant: "destructive",
          });
          return;
        }
        cart[existingIndex].quantity += 1; // Increase quantity
      } else {
        cart.push({ productId: getCurrentProductId, quantity: 1 }); // Add new item
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      toast({
        title: "Product added to cart",
      });

      dispatch(fetchGuestCartDetails(cart)); // ✅ Fetch updated localStorage cart
    } else {
      // Logged-in User - Send API request
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // ✅ Check if the backend prevents over-adding (ensure backend validation too)
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product added to cart",
          });
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
      <DialogContent className="bg-white p-4 sm:p-6 md:p-8 lg:p-12 max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 min-h-[calc(100vh-4rem)]">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={productDetails?.image || "/placeholder.svg"}
              alt={productDetails?.title}
              width={600}
              height={600}
              className="aspect-square rounded-2xl w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-3 mt-2 sm:mb-5 sm:mt-4">
                {productDetails?.description}
              </p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
