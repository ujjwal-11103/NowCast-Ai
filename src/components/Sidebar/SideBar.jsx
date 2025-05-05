import React, { useState } from "react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Menu } from "lucide-react";

const SideBar = () => {
    const { selectedNav, setSelectedNav } = useSidebar();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 bg-[#0A2472] text-white p-2 rounded-md shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            <div
                className={`fixed top-0 left-0 h-screen overflow-y-auto bg-[#E6F0FF] border-r z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 lg:translate-x-0`}
            >
                <div className="p-4">
                    <h2 className="font-medium mb-4">Navigation</h2>
                    <RadioGroup
                        value={selectedNav}
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
                                <RadioGroupItem
                                    value={item}
                                    id={item.toLowerCase().replace(" ", "-")}
                                    className="h-4 w-4 border-2 border-[#0A2472] text-[#0A2472]"
                                />
                                <Label
                                    htmlFor={item.toLowerCase().replace(" ", "-")}
                                    className={`cursor-pointer ${selectedNav === item ? "text-[#0A2472] font-medium" : ""}`}
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
                                    <SelectContent className=" bg-white">
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
        </>
    );
};

export default SideBar;
