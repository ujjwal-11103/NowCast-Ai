
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
        baseURL: "/alfred",
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
            <DialogContent className="sm:max-w-[85vw] !max-w-[85vw] w-full p-0 bg-white shadow-2xl border-none overflow-hidden transition-all duration-300">
                <DialogHeader className="p-8 border-b bg-slate-50/50">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <img src={home} className="w-6 h-6" />
                        </div>
                        <span>Store Insights & Recommendations</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex h-[450px] w-full">
                    <div className="w-2/3 p-10 flex flex-col gap-6">
                        <div className="flex flex-wrap gap-8 border-b border-slate-100 pb-8">
                            {[
                                { label: "Outlet Name", value: outletData?.Outlet },
                                { label: "Customer Group", value: outletData?.Customer },
                                { label: "Distribution Channel", value: outletData?.Channel },
                                { label: "Forecasted Sales", value: formatNumber(outletData?.forecasted_target) },
                                { label: "Achieved Target", value: formatNumber(outletData?.achieved_target) },
                                { label: "Status Indicator", value: outletData?.Status, color: true }
                            ].map((item, idx) => (
                                <div key={idx} className="min-w-[150px] flex-1">
                                    <h5 className="font-bold text-[12px] text-slate-400 font-[Montserrat] uppercase tracking-wider mb-1">{item.label}</h5>
                                    <p className={`font-extrabold text-[16px] font-[Montserrat] text-left leading-tight ${item.color ?
                                        (item.value === "No Alert" ? "text-emerald-600" :
                                            item.value === "Lower than Geo Growth" ? "text-amber-500" :
                                                item.value === "Regulars not selling" ? "text-rose-600" : "text-slate-900") : "text-slate-900"}`}>
                                        {item.value || "N/A"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-10 h-full mt-4">
                            <div className="w-1/2">
                                <h5 className="font-bold text-sm font-[Montserrat] text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3">EASY TO EARN RECOMMENDATIONS</h5>
                                <div className="h-[220px] overflow-auto pr-2 custom-scrollbar">
                                    {goodProducts.map((product, index) => (
                                        <div key={index} className="w-full h-[50px] bg-slate-50 border border-slate-100 rounded-xl flex items-center mb-3 relative group hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-pointer">
                                            <div className="absolute left-[2%] top-[-10px] scale-125">
                                                {dslrICon}
                                            </div>
                                            <h6 className="font-bold text-[13px] font-[Montserrat] text-slate-700 pl-[60px] m-0">{product}</h6>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/2">
                                <h5 className="font-bold text-sm font-[Montserrat] text-slate-800 mb-4 border-l-4 border-rose-500 pl-3">EASY TO SELL RECOMMENDATIONS</h5>
                                <div className="h-[220px] overflow-auto pr-2 custom-scrollbar">
                                    {badProducts.map((product, index) => (
                                        <div key={index} className="w-full h-[50px] bg-slate-50 border border-slate-100 rounded-xl flex items-center mb-3 relative group hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer">
                                            <div className="absolute left-[2%] top-[-10px] scale-125">
                                                {p2picon}
                                            </div>
                                            <h6 className="font-bold text-[13px] font-[Montserrat] text-slate-700 pl-[60px] m-0">{product}</h6>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 bg-slate-100/50 border-l flex flex-col justify-center items-center gap-8 p-6">
                        <div className="h-[45%] w-full bg-emerald-600 rounded-xl flex relative shadow-lg shadow-emerald-100 group hover:scale-[1.02] transition-transform">
                            <div className="relative flex items-center h-full">
                                {shadowIcon}
                                <div className="absolute left-[20px] scale-150">{hornIcon}</div>
                            </div>
                            <div className="flex flex-col justify-center ml-4 pr-6">
                                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">PROMOTION CHANNEL</span>
                                <h5 className="font-extrabold text-[22px] text-white font-[Montserrat] leading-tight">{outletData?.promotion_channel || "None"}</h5>
                            </div>
                        </div>
                        <div className="h-[45%] w-full bg-white border border-slate-200 rounded-xl flex relative shadow-lg shadow-slate-100 group hover:scale-[1.02] transition-transform">
                            <div className="relative flex items-center h-full">
                                {shadowIcon}
                                <div className="absolute left-[20px] scale-150">{impactIcon}</div>
                            </div>
                            <div className="flex flex-col justify-center ml-4 pr-6">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">STRATEGIC COMMENT</span>
                                <h5 className="font-extrabold text-[22px] text-slate-800 font-[Montserrat] leading-tight">{outletData?.Comment || "N/A"}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewDetailPopup;
