// MapComponent.tsx
import { onMount } from "solid-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getData } from "../Dashboard/Ag-Grid/store"; // Import the store
import Chart from "chart.js/auto";

const MapComponent = () => {
  const here = {
    apiKey: "-dP4-fYgBKSHdIBZaFcBPioanO1Ifg4I2aBAfORok7o",
  };

  const style = "normal.day";
  const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;

  let map;
  let kabupatenMarkers = [];

  const locations = [
    { name: "Jakarta", coords: [-6.2088, 106.8456] },
  { name: "Surabaya", coords: [-7.2575, 112.7521] },
  { name: "Medan", coords: [3.5952, 98.6722] },
  { name: "Bali", coords: [-8.3405, 115.092] },
  { name: "Makassar", coords: [-5.1477, 119.4327] },
  { name: "Aceh", coords: [5.5507, 95.3252] },
  { name: "Banten", coords: [-6.1144, 106.2604] },
  { name: "Bengkulu", coords: [-3.8000, 102.2667] },
  { name: "Gorontalo", coords: [0.5600, 123.0600] },
  { name: "Jambi", coords: [-1.6100, 103.6000] },
  { name: "Jawa Barat", coords: [-6.7500, 107.0833] },
  { name: "Jawa Tengah", coords: [-7.2500, 110.7500] },
  { name: "Jawa Timur", coords: [-7.5000, 112.7500] },
  { name: "Kalimantan Barat", coords: [-0.5000, 109.3333] },
  { name: "Kalimantan Selatan", coords: [-3.0000, 114.5833] },
  { name: "Kalimantan Tengah", coords: [-1.8333, 113.9167] },
  { name: "Kalimantan Timur", coords: [0.5000, 117.0833] },
  { name: "Kalimantan Utara", coords: [2.0700, 117.8700] },
  { name: "Kepulauan Bangka Belitung", coords: [-2.7500, 106.0833] },
  { name: "Kepulauan Riau", coords: [0.8667, 104.0833] },
  { name: "Lampung", coords: [-5.4000, 105.2667] },
  { name: "Maluku", coords: [-3.6695, 128.0883] },
  { name: "Maluku Utara", coords: [1.6986, 127.8728] },
  { name: "Nusa Tenggara Barat", coords: [-8.5833, 116.1167] },
  { name: "Nusa Tenggara Timur", coords: [-8.6500, 121.2667] },
  { name: "Papua", coords: [-4.0000, 140.0000] },
  { name: "Papua Barat", coords: [-1.0000, 132.0000] },
  { name: "Riau", coords: [0.5667, 101.4667] },
  { name: "Sulawesi Barat", coords: [-2.7333, 118.8333] },
  { name: "Sulawesi Selatan", coords: [-5.1667, 119.6667] },
  { name: "Sulawesi Tengah", coords: [-1.5833, 120.8333] },
  { name: "Sulawesi Tenggara", coords: [-4.0000, 122.5000] },
  { name: "Sulawesi Utara", coords: [1.5833, 124.8333] },
  { name: "Yogyakarta", coords: [-7.8000, 110.3667] }
  ];

  const kabupatenLocations = [
    // Jakarta
    { name: "Jakarta Selatan", coords: [-6.3016, 106.8255] },
    { name: "Jakarta Barat", coords: [-6.1871, 106.7299] },

    // Surabaya
    { name: "Surabaya Timur", coords: [-7.2903, 112.7646] },
    { name: "Surabaya Barat", coords: [-7.2777, 112.6725] },
    // Add more kabupaten locations...
  ];

  const createPieChart = (maleCount, femaleCount) => {
    const chartCanvas = document.createElement("canvas");
    chartCanvas.style.width = "100px";
    chartCanvas.style.height = "100px";

    new Chart(chartCanvas, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: 'Gender Distribution',
          data: [maleCount, femaleCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverOffset: 4,
        }],
      },
    });

    return chartCanvas;
  };

  const addKabupatenMarkers = () => {
    kabupatenLocations.forEach((location) => {
      const marker = L.marker(location.coords)
        .addTo(map)
        .bindPopup(`<b>${location.name}</b>`)
        .bindTooltip(location.name, { permanent: false, direction: 'top' })
        .on("mouseover", function () {
          this.openTooltip();
          const addressData = getData().address;
          const genderData = getData().gender;
          const address = addressData[location.name] || 0;
          const maleCount = genderData['male'] || 0;
          const femaleCount = genderData['female'] || 0;

          // Create the popup content
          const popupContent = document.createElement('div');
          popupContent.innerHTML = `<b>${location.name}</b><br>Address Count: ${address}<br>Gender Distribution:`;

          // Create the chart
          const chartCanvas = createPieChart(maleCount, femaleCount);
          popupContent.appendChild(chartCanvas);

          this.bindPopup(popupContent).openPopup();
        })
        .on("mouseout", function () {
          this.closeTooltip();
        })
        .on("click", () => {
          map.setView(location.coords, 14);
        });

      kabupatenMarkers.push(marker);
    });
  };

  const removeKabupatenMarkers = () => {
    kabupatenMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
    kabupatenMarkers = [];
  };

  onMount(() => {
    map = L.map("map", {
      center: [-2.548926, 118.0148634],
      zoom: 5,
      layers: [L.tileLayer(hereTileUrl)],
    });

    map.attributionControl.addAttribution("&copy; HERE 2024");

    locations.forEach((location) => {
      L.marker(location.coords)
        .addTo(map)
        .bindPopup(`<b>${location.name}</b>`)
        .bindTooltip(location.name, { permanent: false, direction: 'top' })
        .on("mouseover", function () {
          this.openTooltip();
        })
        .on("mouseout", function () {
          this.closeTooltip();
        })
        .on("click", () => {
          map.setView(location.coords, 12);
        });
    });

    map.on("zoomend", () => {
      const zoomLevel = map.getZoom();
      if (zoomLevel >= 12) {
        addKabupatenMarkers();
      } else {
        removeKabupatenMarkers();
      }
    });
  });

  return (
    <div>
      <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
        <div id="map" style={{ width: "100%", height: "500px" }}></div>
      </div>
    </div>
  );
};

export default MapComponent;
