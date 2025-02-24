import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShoppingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600">
              At Raj Telecom, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy outlines how we collect, use, and safeguard your data when
              you use our website or purchase our products.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Information We Collect</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Personal information (such as name, address, email, and
                      phone number) when you make a purchase or create an
                      account.
                    </li>
                    <li>
                      Payment information when you complete a transaction.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How We Use Your Information</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To process and fulfill your orders.</li>
                    <li>
                      To communicate with you about your orders and provide
                      customer support.
                    </li>
                    <li>To improve our website and services.</li>
                    <li>
                      To send you promotional offers and updates (if youve opted
                      in).
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Data Security</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We implement a variety of security measures to maintain the
                    safety of your personal information. Your personal
                    information is contained behind secured networks and is only
                    accessible by a limited number of persons who have special
                    access rights to such systems.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Third-Party Disclosure</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We do not sell, trade, or otherwise transfer your personally
                    identifiable information to outside parties. This does not
                    include trusted third parties who assist us in operating our
                    website, conducting our business, or servicing you, as long
                    as those parties agree to keep this information
                    confidential.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Cookies</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We use cookies to help us remember and process the items in
                    your shopping cart, understand and save your preferences for
                    future visits, and compile aggregate data about site traffic
                    and site interaction.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Your Rights</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      You have the right to access, correct, or delete your
                      personal information.
                    </li>
                    <li>
                      You can opt out of receiving marketing communications from
                      us at any time.
                    </li>
                    <li>
                      You can request a copy of the personal data we hold about
                      you.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Changes to This Policy
              </h3>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the 21-February-2025 date.
              </p>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
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

            <p className="mt-6 text-sm text-gray-500 text-center">
              Last Updated: 21-February-2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
