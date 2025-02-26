import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  deleteCartItem,
  fetchCartItems,
  fetchGuestCartDetails,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    let newQuantity =
      typeOfAction === "plus"
        ? getCartItem?.quantity + 1
        : getCartItem?.quantity - 1;

    if (newQuantity <= 0) {
      toast({
        title: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    // ✅ Find the product in productList to get its stock
    const currentProduct = productList.find(
      (product) => product._id === getCartItem?.productId
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

    if (newQuantity > totalStock) {
      toast({
        title: `Only ${totalStock} quantity available for this item`,
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      // 🛒 Guest User - Update in localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const index = cart.findIndex(
        (item) => item.productId === getCartItem.productId
      );

      if (index !== -1) {
        cart[index].quantity = newQuantity;
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));

      toast({
        title: "Cart item updated successfully",
      });

      // ✅ Fetch updated cart details for UI update
      dispatch(fetchGuestCartDetails(cart));
    } else {
      // 👤 Logged-in User - Update in backend
      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCartItem?.productId,
          quantity: newQuantity,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cart item updated successfully",
          });

          // ✅ Fetch updated backend cart
          dispatch(fetchCartItems(user?.id));
        }
      });
    }
  }

  function handleCartItemDelete(getCartItem) {
    if (!isAuthenticated) {
      // 🛒 Guest User - Remove from localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Remove the item from the cart
      cart = cart.filter((item) => item.productId !== getCartItem.productId);

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      toast({
        title: "Cart item deleted successfully",
      });

      // ✅ Fetch updated guest cart details to reflect UI changes
      dispatch(fetchGuestCartDetails(cart));
    } else {
      // 👤 Logged-in User - Remove from Backend
      dispatch(
        deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cart item deleted successfully",
          });

          // ✅ Fetch updated backend cart
          dispatch(fetchCartItems(user?.id));
        }
      });
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 p-4 border rounded-lg">
      <div className="flex space-x-4 items-center">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-sm sm:text-base truncate break-words max-w-[150px] sm:max-w-[200px]">
            {cartItem?.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-semibold text-sm sm:text-base">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center sm:flex-col sm:items-end sm:ml-auto">
        <p className="font-semibold text-sm sm:text-base">
          ₹
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer sm:mt-1"
          size={18}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
