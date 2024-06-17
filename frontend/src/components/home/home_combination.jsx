import React, { useRef, useState, useEffect } from 'react';
// npm install styled-components
import styled from 'styled-components';

const BarChartContainer = styled.div`
    // display
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // box
    margin-top: 150px;
`;

const BarTitle = styled.div`
    // font
    color: var(--brown);
    font-family: Bold;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 0.9px;
    // box
    margin-bottom: -250px;
`;

const Chart = styled.div`
    // display
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    // box
    width: 900px;
    height: 500px;
    border-bottom: 2px solid var(--brown);
    transition: height 0.5s ease;
`;

const Bar = styled.div`
    // color block
    background-color: ${props => props.color || 'var(--black)'};
    position: relative;
    // box
    width: 140px;
    height: 100%;
    margin: 0 20px;
    transition: height 1s ease;
`;

const BarText = styled.span`
    // font
    color: var(--brown);
    font-family: Medium;
    font-size: 18px;
    text-align: center;
    // box
    position: absolute;
    bottom: -125px;
    left: 50%;
    transform: translateX(-50%);
`;

const BarNumber = styled.span`
    // font
    color: var(--brown);
    font-family: Regular;
    font-size: 16px;
    // box
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
`;  

const CombinationChart = ({ hgl, mce, meg, mpc, pcb }) => {
    const total = hgl + mce + meg + mpc + pcb;
    const hglPercentage = (hgl / total) * 100;
    const mcePercentage = (mce / total) * 100;
    const megPercentage = (meg / total) * 100;
    const mpcPercentage = (mpc / total) * 100;
    const pcbPercentage = (pcb / total) * 100;

    const [isVisible, setIsVisible] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        const chartElement = chartRef.current;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.8 // Trigger when 80% of the element is in view
        });

        if (chartElement) {
            observer.observe(chartElement);
        }

        return () => {
            if (chartElement) {
                observer.unobserve(chartElement);
            }
        };
    }, []);

    return (
        <BarChartContainer ref={chartRef}>
            <BarTitle>Combination Distribution</BarTitle>
            <Chart ref={chartRef}>
                <Bar color="var(--orange)" style={{ height: isVisible ? `${hglPercentage}%` : '0%' }}>
                    <BarText>History, Geography, Literature (HGL)</BarText>
                    <BarNumber>{hgl}</BarNumber>
                </Bar>
                <Bar color="var(--brown)" style={{ height: isVisible ? `${mcePercentage}%` : '0%' }}>
                    <BarText>Math, Computers, Economies (MCE)</BarText>
                    <BarNumber>{mce}</BarNumber>
                </Bar>
                <Bar color="var(--yellow)" style={{ height: isVisible ? `${megPercentage}%` : '0%' }}>
                    <BarText>Math, Economies, Geography (MEG)</BarText>
                    <BarNumber>{meg}</BarNumber>
                </Bar>
                <Bar color="var(--coffee)" style={{ height: isVisible ? `${mpcPercentage}%` : '0%' }}>
                    <BarText>Math, Physics, Computers (MPC)</BarText>
                    <BarNumber>{mpc}</BarNumber>
                </Bar>
                <Bar color="var(--green)" style={{ height: isVisible ? `${pcbPercentage}%` : '0%' }}>
                    <BarText>Physics, Chemistry, Biology (PCB)</BarText>
                    <BarNumber>{pcb}</BarNumber>
                </Bar>
            </Chart>
        </BarChartContainer>
        
    );
};

export default CombinationChart;