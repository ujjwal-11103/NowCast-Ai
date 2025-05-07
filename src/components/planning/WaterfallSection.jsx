import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import WaterfallChart from "./WaterfallChart";

const WaterfallSection = ({ tableData, consensusValues, teamInputs }) => {

    console.log("Table Data :", tableData);
    console.log("consensus Data :", consensusValues);
    console.log("teamInputs Data :", teamInputs);

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Waterfall Charts</h2>
            </div>

            <Accordion type="multiple" className="flex flex-wrap gap-4 items-start">
                {tableData.map((item) => (
                    <>
                        {/* January Waterfall */}
                        <AccordionItem
                            key={`${item.name}-jan`}
                            value={`${item.name}-jan`}
                            className="w-full md:w-[48%] border rounded-lg overflow-hidden"
                        >
                            <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                <span className="font-medium">{item.name} - Jan Waterfall</span>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <WaterfallChart
                                    data={[
                                        { label: "Forecast", value: item.ForecastJan },
                                        { label: "Sales", value: teamInputs[item.name]?.sales?.jan?.value || 0 },
                                        { label: "Marketing", value: teamInputs[item.name]?.marketing?.jan?.value || 0 },
                                        { label: "Finance", value: teamInputs[item.name]?.finance?.jan?.value || 0 },
                                        { label: "Consensus", value: consensusValues[item.name]?.jan }
                                    ]}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        {/* February Waterfall */}
                        <AccordionItem
                            key={`${item.name}-feb`}
                            value={`${item.name}-feb`}
                            className="w-full md:w-[48%] border rounded-lg overflow-hidden"
                        >
                            <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                                <span className="font-medium">{item.name} - Feb Waterfall</span>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <WaterfallChart
                                    data={[
                                        { label: "Forecast", value: item.ForecastFeb },
                                        { label: "Sales", value: teamInputs[item.name]?.sales?.feb?.value || 0 },
                                        { label: "Marketing", value: teamInputs[item.name]?.marketing?.feb?.value || 0 },
                                        { label: "Finance", value: teamInputs[item.name]?.finance?.feb?.value || 0 },
                                        { label: "Consensus", value: consensusValues[item.name]?.feb }
                                    ]}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </>
                ))}
            </Accordion>
        </div>
    );
};

export default WaterfallSection