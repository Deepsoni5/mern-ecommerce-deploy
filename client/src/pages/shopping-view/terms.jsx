import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShoppingTerms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">
              Welcome to Raj Telecom. These Terms and Conditions govern your use
              of our website and the purchase of mobile accessories from us. By
              accessing or using our website, you agree to abide by these Terms.
              If you do not agree, please refrain from using our services.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Product Warranty & Guarantee
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      There is no warranty or guarantee on screen protectors.
                    </li>
                    <li>
                      Other accessories may come with a warranty as specified in
                      their respective product descriptions.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Return & Replacement Policy</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      No returns or replacements will be accepted for mobile
                      covers and screen protectors.
                    </li>
                    <li>
                      Replacement is only possible in certain cases, such as:
                      <ul className="list-circle pl-5 mt-2 space-y-1">
                        <li>
                          The item received is damaged or defective upon
                          delivery.
                        </li>
                        <li>
                          The item is incorrect (different from what was
                          ordered).
                        </li>
                      </ul>
                    </li>
                    <li>
                      Customers must report any issues within 24 hours of
                      receiving the product.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Order Cancellation</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Orders can only be canceled before they are shipped. Once
                    shipped, cancellations are not possible.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Delivery times vary based on location and availability. We
                      are not responsible for delays caused by courier services.
                    </li>
                    <li>
                      Any shipping damages must be reported immediately upon
                      receipt.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Pricing & Payments</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      All prices listed on our website are final and inclusive
                      of applicable taxes.
                    </li>
                    <li>We accept payments via Razorpay.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Limitation of Liability</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      We are not responsible for any damages caused by improper
                      use of our products.
                    </li>
                    <li>
                      Screen protectors and mobile covers are non-refundable and
                      non-replaceable, regardless of the reason.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600">
                For any queries or concerns, please contact us at{" "}
                <a
                  href="mailto:rajtelecom447@gmail.com"
                  className="text-primary hover:underline"
                >
                  rajtelecom447@gmail.com
                </a>{" "}
                or{" "}
                <a
                  href="tel:+919316354141"
                  className="text-primary hover:underline"
                >
                  +91 93163 54141
                </a>
                .
              </p>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              By using our website and making a purchase, you acknowledge that
              you have read, understood, and agreed to these Terms and
              Conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
