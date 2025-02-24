// Assuming you're using Mongoose
const Contact = require("../../models/Contact");
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, city, pincode, inquiry } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !city || !pincode || !inquiry) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to database
    const newContact = new Contact({
      name,
      email,
      phone,
      city,
      pincode,
      inquiry,
    });

    await newContact.save();

    return res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find(); // Fetch all records from the contacts table
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { submitContactForm, getInquiries };
