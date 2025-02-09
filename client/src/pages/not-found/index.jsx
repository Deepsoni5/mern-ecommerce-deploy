import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <FileQuestion className="h-10 w-10 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <ul className="text-sm text-gray-500 list-none space-y-1 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check the URL for any typos or errors.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Use the navigation menu to find what you are looking for.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Try searching for the content if available on our site.
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link
              to="/shop/listing"
              className="flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/shop/home" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
