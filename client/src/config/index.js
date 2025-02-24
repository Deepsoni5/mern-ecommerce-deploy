export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
  },
];

export const loginFormControls = [
  {
    name: "identifier", // Changed from 'email' to a more general name
    label: "Email or Phone Number",
    placeholder: "Enter your email or phone number",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "airbuds", label: "Air Buds" },
      { id: "cover", label: "Cover" },
      { id: "mobile", label: "Mobile" },
      { id: "watch", label: "Watch" },
      { id: "tablet", label: "Tablet" },
      { id: "temperedglass", label: "Tempered Glass" },
      { id: "speaker", label: "Speaker" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "realme", label: "Realme" },
      { id: "redmi", label: "Redmi" },
      { id: "noise", label: "Noise" },
      { id: "oneplus", label: "Oneplus" },
      { id: "sony", label: "Sony" },
      { id: "lg", label: "LG" },
      { id: "mi", label: "MI" },
      { id: "vivo", label: "Vivo" },
      { id: "oppo", label: "Oppo" },
      { id: "boat", label: "Boat" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "airbuds",
    label: "Air Buds",
    path: "/shop/listing",
  },
  {
    id: "cover",
    label: "Cover",
    path: "/shop/listing",
  },
  {
    id: "mobile",
    label: "Mobile",
    path: "/shop/listing",
  },
  {
    id: "watch",
    label: "Watch",
    path: "/shop/listing",
  },
  {
    id: "tablet",
    label: "Tablet",
    path: "/shop/listing",
  },
  {
    id: "speaker",
    label: "Speaker",
    path: "/shop/listing",
  },
  {
    id: "temperedglass",
    label: "Tempered Glass",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  airbuds: "Air Buds",
  cover: "Cover",
  mobile: "Mobile",
  watch: "Watch",
  tablet: "Tablet",
  temperedglass: "Tempered Glass",
  speaker: "Speaker",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  realme: "Realme",
  redmi: "Redmi",
  noise: "Noise",
  oneplus: "Oneplus",
  sony: "Sony",
  lg: "LG",
  mi: "MI",
  vivo: "Vivo",
  oppo: "Oppo",
  boat: "Boat",
};

export const filterOptions = {
  category: [
    { id: "airbuds", label: "Air Buds" },
    { id: "cover", label: "Cover" },
    { id: "mobile", label: "Mobile" },
    { id: "watch", label: "Watch" },
    { id: "tablet", label: "Tablet" },
    { id: "temperedglass", label: "Tempered Glass" },
    { id: "speaker", label: "Speaker" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "realme", label: "Realme" },
    { id: "redmi", label: "Redmi" },
    { id: "noise", label: "Noise" },
    { id: "oneplus", label: "Oneplus" },
    { id: "sony", label: "Sony" },
    { id: "lg", label: "LG" },
    { id: "mi", label: "MI" },
    { id: "vivo", label: "Vivo" },
    { id: "oppo", label: "Oppo" },
    { id: "boat", label: "Boat" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
