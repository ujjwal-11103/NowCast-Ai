import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SideBar = () => {
  const [selectedNav, setSelectedNav] = useState("Planning");

  return (
    <div className="w-64 h-full bg-[#E6F0FF] border-r flex flex-col">
      <div className="p-4">
        <h2 className="font-medium mb-4">Navigation</h2>
        <RadioGroup
          defaultValue="Planning"
          className="space-y-2"
          onValueChange={setSelectedNav}
        >
          {[
            "Overall",
            "Ingestion",
            "Planning",
            "Reporting",
            "Error Analysis",
            "Norms",
            "Supply Chain",
          ].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <RadioGroupItem value={item} id={item.toLowerCase().replace(" ", "-")} />
              <Label
                htmlFor={item.toLowerCase().replace(" ", "-")}
                className={`cursor-pointer ${
                  selectedNav === item ? "text-[#0A2472] font-medium" : ""
                }`}
              >
                {item}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="p-4 border-t">
        <div className="space-y-4">
          {[
            {
              label: "Channel",
              default: "channel-2",
              items: ["channel-1", "channel-2", "channel-3"],
            },
            {
              label: "Chain",
              default: "chain-3",
              items: ["chain-1", "chain-2", "chain-3"],
            },
            {
              label: "Depot",
              default: "depot-5",
              items: ["depot-1", "depot-3", "depot-5"],
            },
            {
              label: "SubCat",
              default: "subcat-5",
              items: ["subcat-3", "subcat-4", "subcat-5"],
            },
            {
              label: "SKU",
              default: "sku-10",
              items: ["sku-5", "sku-9", "sku-10"],
            },
          ].map(({ label, default: defaultValue, items }) => (
            <div key={label}>
              <h3 className="text-sm font-medium mb-2">{label}</h3>
              <Select defaultValue={defaultValue}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replace(/-/g, " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
