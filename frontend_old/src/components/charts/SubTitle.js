import React from "react";
import "./chart.css";

const SubTitle = ({
  radius,
  fill,
  textAnchor,
  subTitle1
}) => {
  return (
    <text x={radius} y={radius} fill={fill} textAnchor={textAnchor}>
      <tspan className="chart-title">{subTitle1}</tspan>
      <tspan x={radius} y={radius + 20}>
      </tspan>
    </text>
  );
};

export default SubTitle;