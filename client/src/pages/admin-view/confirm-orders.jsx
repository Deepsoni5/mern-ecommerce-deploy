import { useEffect, useState } from "react";
import { Button } from "../../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { Dialog } from "../../../src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/components/ui/table";
import AdminOrderDetailsView from "../../components/admin-view/order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../../../src/components/ui/badge";

function AdminConfirmOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Filter confirmed orders based on the selected date
  const confirmedOrders = orderList.filter(
    (order) =>
      order.orderStatus === "confirmed" &&
      (!selectedDate || order.orderDate.split("T")[0] === selectedDate)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmed Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Date Picker for Filtering Orders */}
        <div className="mb-4 flex items-center gap-4">
          <label className="font-semibold">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />
          <Button onClick={() => setSelectedDate("")}>Clear Filter</Button>
        </div>

        {/* Orders Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Selected Model</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {confirmedOrders.length > 0 ? (
              [...confirmedOrders].reverse().map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>
                    {orderItem?.cartItems?.map((cartItem, index) => (
                      <div key={index} className="flex flex-col gap-1">
                        <span className="font-semibold">{cartItem.title}</span>
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
                  <TableCell>{orderItem?.addressInfo?.city}</TableCell>
                  <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge className="py-1 px-3 bg-green-500">
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No confirmed orders found{" "}
                  {selectedDate && `for ${selectedDate}`}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminConfirmOrders;
