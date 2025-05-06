import React, { useEffect, useState } from "react";
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

import data from "../../jsons/Planning/JF_censored.json"

const SideBar = () => {
    const { selectedNav, setSelectedNav } = useSidebar();
    const [isOpen, setIsOpen] = useState(true);

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedChain, setSelectedChain] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    const [selectedSubSKU, setSelectedSubSKU] = useState(null);

    const [channelOptions, setChannelOptions] = useState([]);
    const [chainOptions, setChainOptions] = useState([]);
    const [depotOptions, setDepotOptions] = useState([]);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const [skuOptions, setSkuOptions] = useState([]);

    // Load unique channels initially
    useEffect(() => {
        const channels = [...new Set(data.map(item => item.Channel))];
        setChannelOptions(channels);
    }, []);

    useEffect(() => {
        if (selectedChannel) {
            const filtered = data.filter(item => item.Channel === selectedChannel);
            setChainOptions([...new Set(filtered.map(item => item.Chain))]);
            setSelectedChain(null);
            setDepotOptions([]);
            setSubCatOptions([]);
            setSkuOptions([]);
        }
    }, [selectedChannel]);

    useEffect(() => {
        if (selectedChain) {
            const filtered = data.filter(
                item => item.Channel === selectedChannel && item.Chain === selectedChain
            );
            setDepotOptions([...new Set(filtered.map(item => item.Depot))]);
            setSelectedDepot(null);
            setSubCatOptions([]);
            setSkuOptions([]);
        }
    }, [selectedChain]);

    useEffect(() => {
        if (selectedDepot) {
            const filtered = data.filter(
                item =>
                    item.Channel === selectedChannel &&
                    item.Chain === selectedChain &&
                    item.Depot === selectedDepot
            );
            setSubCatOptions([...new Set(filtered.map(item => item.SubCat))]);
            setSelectedSubCat(null);
            setSkuOptions([]);
        }
    }, [selectedDepot]);

    useEffect(() => {
        if (selectedSubCat) {
            const filtered = data.filter(
                item =>
                    item.Channel === selectedChannel &&
                    item.Chain === selectedChain &&
                    item.Depot === selectedDepot &&
                    item.SubCat === selectedSubCat
            );
            setSkuOptions([...new Set(filtered.map(item => item.SKU))]);
        }
    }, [selectedSubCat]);

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

                <div className="p-4 border-t space-y-4">
                    {/* Channel */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Channel</h3>
                        <Select onValueChange={setSelectedChannel}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {channelOptions.map(channel => (
                                    <SelectItem key={channel} value={channel}>
                                        {channel.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Chain */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Chain</h3>
                        <Select onValueChange={setSelectedChain} disabled={!selectedChannel}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {chainOptions.map(chain => (
                                    <SelectItem key={chain} value={chain}>
                                        {chain.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Depot */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Depot</h3>
                        <Select onValueChange={setSelectedDepot} disabled={!selectedChain}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select depot" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {depotOptions.map(depot => (
                                    <SelectItem key={depot} value={depot}>
                                        {depot.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* SubCat */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">SubCat</h3>
                        <Select onValueChange={setSelectedSubCat} disabled={!selectedDepot}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select subcat" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {subCatOptions.map(subcat => (
                                    <SelectItem key={subcat} value={subcat}>
                                        {subcat.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* SKU */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">SKU</h3>
                        <Select onValueChange={setSelectedSubSKU} disabled={!selectedSubCat}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select SKU" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {skuOptions.map(sku => (
                                    <SelectItem key={sku} value={sku}>
                                        {sku.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
