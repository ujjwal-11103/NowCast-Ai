import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MetricCard = ({
  title,
  value,
  subtitle,
  valueColor = "text-black",
  subtitleColor = "text-gray-500",
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
