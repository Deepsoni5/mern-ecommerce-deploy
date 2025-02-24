import Address from "@/components/shopping-view/address";
import img from "../../../public/chk_img.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";
import ShoppingHeader from "@/components/shopping-view/header";
import { Link } from "react-router-dom";
function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your Cart is Empty! Please Add Some Items To Procced!",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please Select an Address to Procced!",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      razorpayOrderId: "",
      razorpayPaymentId: "",
      razorpaySignature: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
        const options = {
          key: "rzp_live_mhZELWZlesB3Tg",
          amount: data?.payload?.order?.totalAmount,
          currency: "INR",
          name: "Raj Telecom",
          description: "Test Transaction",
          order_id: data?.payload?.razorOrder,
          callback_url: `${
            import.meta.env.VITE_API_URL
          }/api/shop/order/capture`, // Your success URL
          prefill: {
            name: user?.userName,
            email: user?.email,
            contact: "9999999999",
          },
          theme: {
            color: "#121212",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  return (
    <div className="flex flex-col">
      <ShoppingHeader />
      {/*<div className="relative hidden h-[800px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.id} cartItem={item} />
              ))
            : null}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart
                ? "Processing Razorpay Payment..."
                : "Checkout with Razorpay"}
            </Button>
            <p className="mt-2 text-sm text-gray-600 text-center">
              By placing an order, you agree to our{" "}
              <Link to="/shop/terms" className="text-blue-600 underline">
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
