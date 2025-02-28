import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  cancelOrder,
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { MessageCircle } from "lucide-react";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();
  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleWhatsAppFeedback(orderId, amount) {
    const phoneNumber = "919316354141"; // WhatsApp number
    const message = `Hello, I would like to share feedback on my order.\nOrder ID: ${orderId}\nTotal Amount: ₹${amount}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  }

  function handleCancelOrder(orderId) {
    dispatch(cancelOrder(orderId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Order cancelled successfully",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Selected Model</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? [...orderList]
                  .reverse()
                  .filter((orderItem) => orderItem.orderStatus !== "pending")
                  .map((orderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell>{orderItem?._id}</TableCell>
                      <TableCell>
                        {orderItem?.cartItems?.map((cartItem, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <span className="font-semibold">
                              {cartItem.title}
                            </span>
                            {cartItem?.selectedModels &&
                            cartItem.selectedModels.length > 0 ? (
                              cartItem.selectedModels.map((model, idx) => (
                                <span key={idx} className="text-sm">
                                  {model.modelName} (x{model.quantity})
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500"></span>
                            )}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-2 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : orderItem?.orderStatus === "cancelled"
                              ? "bg-orange-500" // Orange for cancelled orders
                              : "bg-black text-white hover:text-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{orderItem?.totalAmount}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="p-2 text-green-600"
                          onClick={() =>
                            handleWhatsAppFeedback(
                              orderItem?._id,
                              orderItem?.totalAmount
                            )
                          }
                        >
                          <MessageCircle className="w-10 h-10" />
                          <p>WhatsApp</p>
                        </Button>
                      </TableCell>
                      <TableCell>
                        {orderItem?.orderStatus === "confirmed" && (
                          <Button
                            variant="outline"
                            className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white transition-colors duration-200 flex items-center gap-2 rounded-2xl"
                            onClick={() => handleCancelOrder(orderItem?._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Cancel Order
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                          <ShoppingOrderDetailsView
                            orderDetails={orderDetails}
                          />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
