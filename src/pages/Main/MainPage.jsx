import React from "react";
import { useSidebar } from "@/context/sidebar/SidebarContext";
import SideBar from "@/components/Sidebar/SideBar";
import Overall from "../Overall/Overall";
import Ingestion from "../Ingestion/Ingestion";
import Planning from "../Planning/Planning";
import Reporting from "../Reporting/Reporting";
import ErrorAnalysis from "../Error Analysis/ErrorAnalysis";
import Norms from "../Norms/Norms";
import SupplyChainTower from "../supplychaintower/SupplyChainTower";

const MainPage = () => {
    const { selectedNav } = useSidebar();
    // console.log(selectedNav);


    return (
        <div className="flex">
            <SideBar />
            <div className="w-full md:ml-64">
                {/* <h1 className="text-xl font-bold mb-4">{selectedNav}</h1> */}
                {selectedNav === "Overall" && <Overall />}
                {selectedNav === "Ingestion" && <Ingestion />}
                {selectedNav === "Planning" && <Planning />}
                {selectedNav === "Reporting" && <Reporting />}
                {selectedNav === "Error Analysis" && <ErrorAnalysis />}
                {selectedNav === "Norms" && <Norms />}
                {selectedNav === "Supply Chain" && <SupplyChainTower />}
            </div>

        </div>
    );
};

export default MainPage;
