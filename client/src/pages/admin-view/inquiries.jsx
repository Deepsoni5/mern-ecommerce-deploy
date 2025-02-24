"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { getInquiries } from "@/store/common-slice";

const InquiryItem = ({ inquiry, style }) => (
  <AccordionItem key={inquiry._id} value={inquiry._id} style={style}>
    <AccordionTrigger className="hover:no-underline">
      <div className="flex justify-between items-center w-full pr-4">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {formatDistanceToNow(new Date(inquiry.createdAt), {
              addSuffix: true,
            })}
          </Badge>
          <span className="font-medium">{inquiry.name}</span>
        </div>
        <span className="text-sm text-gray-500 truncate max-w-[200px]">
          {inquiry.inquiry}
        </span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
        <div>
          <p className="text-sm font-semibold text-gray-500">Email</p>
          <p>{inquiry.email}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Phone</p>
          <p>{inquiry.phone}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">City</p>
          <p>{inquiry.city}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Pincode</p>
          <p>{inquiry.pincode}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-gray-500">Inquiry</p>
          <p>{inquiry.inquiry}</p>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function AdminInquiries() {
  const dispatch = useDispatch();
  const { inquiries, isLoading } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getInquiries()); // Fetch data on mount
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(
      (inquiry) =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.inquiry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inquiries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Customer Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Accordion type="single" collapsible className="w-full">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredInquiries.map((inquiry) => (
                  <InquiryItem key={inquiry._id} inquiry={inquiry} />
                ))}
              </div>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
