
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import tresseme from '../../../assets/img/tresseme.png'
import lemon from '../../../assets/img/lemon.png'
import himalyan from '../../../assets/img/himalyan.png'
import dove from '../../../assets/img/dove.png'
import horn from '../../../assets/img/horn.png'
import dslr from '../../../assets/img/dslr.png'
import p2p from '../../../assets/img/p2p.png'
import impact from '../../../assets/img/impact.png'
import shadow from '../../../assets/img/promotonShadow.png'
import home from '../../../assets/img/outletHome.png'

function ViewDetailPopup({ visible, closeAction, rowData }) {
    const dslrICon = <img src={dslr} className="w-[30px] h-[20px]" />
    const p2picon = <img src={p2p} className="w-[30px] h-[20px]" />
    const hornIcon = <img src={horn} />
    const impactIcon = <img src={impact} />
    const shadowIcon = <img src={shadow} />

    const axiosInstance = axios.create({
        baseURL: "http://13.71.126.202:8085/",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const [outletData, setOutletData] = useState({
        "Outlet": "",
        "Customer": "",
        "Channel": "",
        "forecasted_target": 0,
        "achieved_target": 0,
        "Status": "No Alert",
        "E2E": [],
        "E2S": [],
        "promotion_channel": "",
        "Comment": ""
    });

    const [goodProducts, setGoodProducts] = useState([]);
    const [badProducts, setBadProducts] = useState([]);

    useEffect(() => {
        if (visible && rowData) {
            fetchoutletData();
        }
    }, [visible, rowData]);

    const fetchoutletData = async () => {
        const payload = {
            outlet: rowData?.Outlet || rowData?.Customer // Fallback if Outlet ID is not directly available, though API expects 'outlet'
        }
        try {
            // Note: In Alfred.jsx rowData seems to be just what's clicked. 
            // If the clicked row doesn't have 'Outlet' field, this might fail or need adjustment.
            // Based on Alfred.jsx, it sends `props?.rowData?.Outlet`.

            const response = await axiosInstance.post("/alfred/outlet-data/", payload);
            setOutletData(response?.data?.records);
            setGoodProducts(response?.data?.records?.E2E || []);
            setBadProducts(response?.data?.records?.E2S || []);
        } catch (err) {
            console.error(err);
        }
    };

    function formatNumber(number) {
        if (!number) return "0";
        if (number >= 1e9) {
            return (number / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
        } else if (number >= 1e6) {
            return (number / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (number >= 1e3) {
            return (number / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
            return number?.toString();
        }
    }

    return (
        <Dialog open={visible} onOpenChange={closeAction}>
            <DialogContent className="max-w-[65vw] p-0 bg-white">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <img src={home} className="w-5 h-5" />
                        <span>Outlet Details</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex h-[335px] w-full">
                    <div className="w-2/3 p-6 flex flex-col gap-1">
                        <div className="flex flex-wrap gap-2 h-[30%] border-b border-gray-300 pb-2">
                            {[
                                { label: "Outlet", value: outletData?.Outlet },
                                { label: "Customer", value: outletData?.Customer },
                                { label: "Channel", value: outletData?.Channel },
                                { label: "Forecasted Sales", value: formatNumber(outletData?.forecasted_target) },
                                { label: "Achieved Target", value: formatNumber(outletData?.achieved_target) },
                                { label: "Status", value: outletData?.Status, color: true }
                            ].map((item, idx) => (
                                <div key={idx} className="w-[30%]">
                                    <h5 className="font-medium text-[10px] text-gray-500 font-[Montserrat]">{item.label}</h5>
                                    <p className={`font-semibold text-[12px] font-[Montserrat] text-left ${item.color ?
                                        (item.value === "No Alert" ? "text-green-600" :
                                            item.value === "Lower than Geo Growth" ? "text-orange-500" :
                                                item.value === "Regulars not selling" ? "text-red-600" : "text-black") : "text-[#1B1A1C]"}`}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 h-[70%] mt-2">
                            <div className="w-1/2">
                                <h5 className="font-semibold text-[11px] font-[Montserrat]">Easy To Earn Recommendations</h5>
                                <div className="h-[90%] overflow-auto py-4">
                                    {goodProducts.map((product, index) => (
                                        <div key={index} className="w-full h-[35px] bg-[#F7F7F7] rounded flex items-center mb-2 relative cursor-pointer">
                                            <div className="absolute left-[4%] top-[-11px]">
                                                {dslrICon}
                                            </div>
                                            <h6 className="font-semibold text-[9px] font-[Montserrat] pl-[50px] m-0">{product}</h6>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/2">
                                <h5 className="font-semibold text-[11px] font-[Montserrat]">Easy To Sell Recommendations</h5>
                                <div className="h-[90%] overflow-auto py-4">
                                    {badProducts.map((product, index) => (
                                        <div key={index} className="w-full h-[35px] bg-[#F7F7F7] rounded flex items-center mb-2 relative cursor-pointer">
                                            <div className="absolute left-[4%] top-[-11px]">
                                                {p2picon}
                                            </div>
                                            <h6 className="font-semibold text-[9px] font-[Montserrat] pl-[50px] m-0">{product}</h6>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 bg-[#F1F1F1] flex flex-col justify-center items-center gap-5 p-2">
                        <div className="h-[40%] w-[90%] bg-[#268F5F] rounded-r-md flex relative">
                            <div className="relative flex items-center">
                                {shadowIcon}
                                <div className="absolute left-[15px]">{hornIcon}</div>
                            </div>
                            <div className="flex items-center ml-5 pl-6">
                                <h5 className="font-semibold text-[20px] text-white font-[Montserrat]">{outletData?.promotion_channel}</h5>
                            </div>
                        </div>
                        <div className="h-[40%] w-[90%] bg-[#D6D6D6] rounded-r-md flex relative">
                            <div className="relative flex items-center">
                                {shadowIcon}
                                <div className="absolute left-[15px]">{impactIcon}</div>
                            </div>
                            <div className="flex items-center ml-5 pl-6">
                                <h5 className="font-semibold text-[20px] text-black font-[Montserrat]">{outletData?.Comment}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewDetailPopup;
