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

  const [selectedModels, setSelectedModels] = useState({});

  function handleAddtoCart(getCurrentProductId) {
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
                handleAddtoCart={(productId) =>
                  handleAddtoCart(productId, selectedModels)
                }
                selectedModels={selectedModels} // ✅ Pass selected models
                setSelectedModels={setSelectedModels}
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
