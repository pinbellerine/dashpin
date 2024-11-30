import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

const PieChartDonutShare: Component = () => {
  const [legendList, setLegendList] = createSignal([]);
  const [chartData, setChartData] = createSignal([]);
  let divRef: any;
  let rootRef: any;

  onCleanup(() => {
    if (rootRef) {
      rootRef.dispose();
    }
  });

  onMount(() => {
    const legend = [
      {
        name: 'Male',
        color: '#41CFC6',
        field: 'male'
      },
      {
        name: 'Female',
        color: '#FF6847',
        field: 'female'
      },
      {
        name: 'Total',
        color: '#00000000',
        field: 'total'
      },
    ];
    setLegendList(legend);
    fetchChartData(); // Fetch data and create the chart after data is available
  });

  const fetchChartData = async () => {
    try {
      const response = await fetch('http://localhost:8080/pengguna/gender');
      if (response.ok) {
        const data = await response.json();
        const totalCount = data.reduce((acc: number, item: { count: number }) => acc + item.count, 0);
        const formattedData = data.map((item: { gender: string, count: number }) => ({
          category: item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
          value: item.count
        })).concat([{ category: "Total", value: totalCount }]);

        setChartData(formattedData);
        createChart(formattedData);
      } else {
        console.error('Failed to fetch gender data');
      }
    } catch (error) {
      console.error('Error fetching gender data:', error);
    }
  };

  const createChart = (data: any[]) => {
    let root = am5.Root.new(divRef);
    rootRef = root;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: true,
    }));

    series.slices.template.setAll({
      cornerRadius: 5,
      tooltipText: "{category}: {value}"
    });

    series.labels.template.setAll({
      text: "{category}: {value}",
      textType: "radial",
      radius: 10,
    });

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  };

  return (
    <div ref={divRef} style={{ width: '50vw', height: '50vh', margin: '-1vw' }}>
    </div>
  );
};

export default PieChartDonutShare;
