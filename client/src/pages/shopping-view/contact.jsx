import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { submitContactForm } from "@/store/common-slice";

export default function ShoppingContact() {
  const dispatch = useDispatch();
  const { isContactSubmitting, isContactSuccess, isContactError } = useSelector(
    (state) => state.commonFeature
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    inquiry: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(submitContactForm(formData));
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      pincode: "",
      inquiry: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    {key === "inquiry" ? (
                      <Textarea
                        id={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={`Your ${key}`}
                        rows={4}
                        required
                      />
                    ) : (
                      <Input
                        id={key}
                        type={key === "email" ? "email" : "text"}
                        value={value}
                        onChange={handleChange}
                        placeholder={`Your ${key}`}
                        required
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
                {isContactSubmitting && (
                  <p className="text-blue-500">Submitting...</p>
                )}
                {isContactSuccess && (
                  <p className="text-green-500">Form submitted successfully!</p>
                )}
                {isContactError && (
                  <p className="text-red-500">
                    Error submitting form. Try again.
                  </p>
                )}
              </form>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-4">
                  We are here to help and answer any questions you might have.
                  We look forward to hearing from you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-primary" />
                  <span>+91 93163 54141</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary" />
                  <span>rajtelecom447@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary" />
                  <span>Raj Telecom, Astron Chowk, Rajkot</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Business Hours</h4>
                <p className="text-gray-600">
                  Monday - Saturday: 9am to 10pm
                  <br />
                  Sunday: 9am to 5pm
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
