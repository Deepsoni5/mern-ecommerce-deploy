import { useState } from "react";
import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  const [openDropdown, setOpenDropdown] = useState({
    category: false,
    brand: false,
  });

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-background rounded-lg shadow-sm p-4">
      {/* Filters Section */}
      <div className="border-b pb-3">
        {/* Small Screens: Filters + Dropdowns in One Row */}
        <div className="flex md:hidden flex-wrap items-center gap-4">
          <h2 className="text-lg font-extrabold">Filters:</h2>

          {Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem} className="relative">
              {/* Dropdown Button */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white shadow-sm"
                onClick={() => toggleDropdown(keyItem)}
              >
                {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                {openDropdown[keyItem] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {/* Dropdown Content */}
              {openDropdown[keyItem] && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md z-50 p-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      className="flex font-medium items-center gap-2 py-1"
                      key={option.id}
                    >
                      <Checkbox
                        checked={
                          filters &&
                          filters[keyItem] &&
                          filters[keyItem].includes(option.id)
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Large Screens: Filters & Checkboxes in Columns */}
        <div className="hidden md:flex flex-col gap-4 mt-4">
          <h2 className="text-lg font-extrabold">Filters:</h2>

          {/* Updated: Stack Category and Brand in Separate Columns */}
          <div className="flex flex-col gap-8">
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="flex flex-col">
                <h3 className="font-bold">{keyItem}</h3>
                {filterOptions[keyItem].map((option) => (
                  <Label
                    className="flex font-medium items-center gap-2 py-1"
                    key={option.id}
                  >
                    <Checkbox
                      checked={
                        filters &&
                        filters[keyItem] &&
                        filters[keyItem].includes(option.id)
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
