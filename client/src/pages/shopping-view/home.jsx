import {
  Airplay,
  BabyIcon,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  fetchTopRatedProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";
import { AnimatePresence, motion } from "framer-motion";
import { WhyChooseUs } from "./WhyChooseUs";
import { Testimonials } from "./Testimonials";

const categoriesWithIcon = [
  { id: "men", label: "Buds", icon: ShirtIcon },
  { id: "women", label: "Cover", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const categoriesWithImage = [
  {
    id: "airbuds",
    label: "Air Buds",
    imageUrl: "/cat_buds.jpg",
  },
  {
    id: "cover",
    label: "Cover",
    imageUrl: "/cat_cover.jpg",
  },
  {
    id: "mobile",
    label: "Mobile",
    imageUrl: "/cat_mobile.jpg",
  },
  {
    id: "watch",
    label: "Watch",
    imageUrl: "/cat_watch.jpg",
  },
  {
    id: "tablet",
    label: "Tablet",
    imageUrl: "/cat_tablet.jpg",
  },
  {
    id: "temperedglass",
    label: "Tempered Glass",
    imageUrl: "/cat_glass.jpg",
  },
  {
    id: "speaker",
    label: "Speaker",
    imageUrl: "/cat_speaker.jpg",
  },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const brandsWithLogo = [
  {
    id: "apple",
    name: "Apple",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: "samsung",
    name: "Samsung",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    id: "realme",
    name: "Realme",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg",
  },
  {
    id: "redmi",
    name: "Redmi",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Redmi_Logo.png",
  },
  {
    id: "noise",
    name: "Noise",
    logoUrl: "/b_noise.png",
  },
  {
    id: "oneplus",
    name: "OnePlus",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/OnePlus_logo.png",
  },
  {
    id: "sony",
    name: "Sony",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
  },
  {
    id: "lg",
    name: "LG",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Flag_of_LG.svg",
  },
  {
    id: "mi",
    name: "Mi",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
  },
  {
    id: "vivo",
    name: "Vivo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Vivo_New_Logo_2019.png",
  },
  {
    id: "oppo",
    name: "OPPO",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/OPPO_LOGO_2019.svg",
  },
  {
    id: "boat",
    name: "boAt",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Boat-logo.png",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails, rateProductList } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCategoryCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCategoryCount(4);
      } else {
        setVisibleCategoryCount(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextCategory = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, categoriesWithImage.length - visibleCategoryCount)
    );
  };

  const prevCategory = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const showLeftArrow = startIndex > 0;
  const showRightArrow =
    startIndex < categoriesWithImage.length - visibleCategoryCount;

  const [brandStartIndex, setBrandStartIndex] = useState(0);
  const [visibleBrandCount, setVisibleBrandCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleBrandCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleBrandCount(4);
      } else {
        setVisibleBrandCount(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextBrand = () => {
    setBrandStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, brandsWithLogo.length - visibleBrandCount)
    );
  };

  const prevBrand = () => {
    setBrandStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const showBrandLeftArrow = brandStartIndex > 0;
  const showBrandRightArrow =
    brandStartIndex < brandsWithLogo.length - visibleBrandCount;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTopRatedProducts());
  }, [dispatch]);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log({
    startIndex,
    totalItems: categoriesWithImage.length,
    visibleCategoryCount,
    showRightArrow:
      startIndex < categoriesWithImage.length - visibleCategoryCount,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute inset-0 transition-opacity duration-1000 ease-in-out`}
              >
                <img
                  src={slide?.image || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute rounded-full top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute rounded-full top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </Button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featureImageList.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="relative">
            {showLeftArrow && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
                onClick={prevCategory}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {showRightArrow && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
                onClick={nextCategory}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                initial={false}
                animate={{
                  x: `calc(-${startIndex * (100 / visibleCategoryCount)}% - ${
                    startIndex * 1.5
                  }rem)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {categoriesWithImage.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="w-[48%] sm:w-[30%] lg:w-[18%] flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() =>
                        handleNavigateToListingPage(category, "category")
                      }
                      className="cursor-pointer group"
                    >
                      <div className="relative mb-3 bg-gray-100 rounded-2xl overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={category.imageUrl || "/placeholder.svg"}
                            alt={category.label}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="text-center text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {category.label}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="relative">
            {showBrandLeftArrow && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
                onClick={prevBrand}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {showBrandRightArrow && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
                onClick={nextBrand}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                initial={false}
                animate={{
                  x: `calc(-${brandStartIndex * (100 / visibleBrandCount)}% - ${
                    brandStartIndex * 1.5
                  }rem)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {brandsWithLogo.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    className="w-[48%] sm:w-[30%] lg:w-[18%] flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() =>
                        handleNavigateToListingPage(brand, "brand")
                      }
                      className="cursor-pointer group"
                    >
                      <div className="relative mb-3 bg-white rounded-2xl overflow-hidden shadow-md">
                        <div className="aspect-[4/3] overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={brand.logoUrl || "/placeholder.svg"}
                            alt={brand.name}
                            className="w-full h-full object-contain transition duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="text-center text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {brand.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Rated Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rateProductList && rateProductList.length > 0
              ? rateProductList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <Testimonials />
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
