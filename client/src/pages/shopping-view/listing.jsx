import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {
  addToCart,
  fetchCartItems,
  fetchGuestCartDetails,
} from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import NoProductsPage from "./NoProductFound";
function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const categorySearchParam = searchParams.get("category");
  const [searchParams1, setSearchParams1] = useSearchParams();

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
    setSearchParams1({ product: getCurrentProductId });
  }

  useEffect(() => {
    const productIdFromURL = searchParams.get("product");
    if (productIdFromURL) {
      dispatch(fetchProductDetails(productIdFromURL));
    }
  }, [searchParams1, dispatch]);

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  // function handleAddtoCart(getCurrentProductId, getTotalStock) {
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

  function handleAddtoCart(getCurrentProductId) {
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
      const cartItem = cartItems?.items.find(
        (item) => item.productId === getCurrentProductId
      );
      const currentQuantity = cartItem ? cartItem.quantity : 0;

      // ✅ Check if adding one more exceeds the stock limit
      if (currentQuantity >= totalStock) {
        toast({
          title: `Only ${totalStock} quantity available for this item`,
          variant: "destructive",
        });
        return;
      }
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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {productList && productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {productList.map((productItem) => (
              <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                key={productItem._id}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        ) : (
          <NoProductsPage /> // This will now take full width
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
