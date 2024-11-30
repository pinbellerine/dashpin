import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

const LineChartShare: Component = () => {
  const [chartData, setChartData] = createSignal([]);
  let divRef: any;
  let rootRef: any;

  onCleanup(() => {
    if (rootRef) {
      rootRef.dispose();
    }
  });

  onMount(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 500); // Fetch every 5 seconds

    // Cleanup interval on component unmount
    onCleanup(() => clearInterval(intervalId));
  });

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna/gender');
      const data = await response.json();

      // Transform data to match the chart format
      const formattedData = data.map((item: { gender: string, count: number }) => ({
        category: item.gender.charAt(0).toUpperCase() + item.gender.slice(1), // Capitalize gender
        value: item.count
      }));

      setChartData(formattedData);
      updateChart(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createChart = (data: any) => {
    let root = am5.Root.new(divRef);
    rootRef = root;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 80,
      pan: "zoom"
    });

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: xRenderer,
    }));

    xAxis.get("renderer").labels.template.setAll({
      fontFamily: 'Roboto',
      fontSize: "12",
      marginLeft: 10,
    });
    xAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));

    xRenderer.grid.template.setAll({
      location: 1
    });

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    }));

    yAxis.get("renderer").labels.template.setAll({
      fontFamily: 'Roboto',
      fontSize: "12",
    });

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  };

  const updateChart = (data: any) => {
    if (rootRef) {
      // If chart exists, update the data
      const chart = rootRef.container.children[0];
      const xAxis = chart.xAxes.values[0];
      const series = chart.series.values[0];

      xAxis.data.setAll(data);
      series.data.setAll(data);

      // Invalidate raw data to trigger chart redraw
      series.invalidateRawData();
    } else {
      // If chart doesn't exist, create a new one
      createChart(data);
    }
  };

  return (
    <div ref={el => divRef = el} style={{ width: '50vw', height: '50vh', margin: '-1vw' }}>
    </div>
  );
}

export default LineChartShare;
