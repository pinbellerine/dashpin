import { Component } from "solid-js";
import LineChartShare from "./dashboard-chart/chart";
import UserList from "./Ag-Grid/Ag-Grid";
import PieChartShare from "./dashboard-chart/PieChart";
import TampilanAwal from "./TampilanAwal/tampilanawal";
import Navbar from "./TampilanAwal/Navbar";
import './dashboard.css';

const Dashboard: Component = () => {

  const handleSearch = (query: string) => {
    // Implement search logic here, or pass it to a child component (e.g., the map component)
    console.log("Search query:", query);
  };
  return (
    <>
       <Navbar onSearch={handleSearch} />

      <div class="Awal"> 
          <TampilanAwal/>
       </div>

       <div class="List">
          <UserList/>
        </div>

      <div class="chartsGrid">
          <div class="chart">
          <LineChartShare />
          </div>

          <div class="chart">
          <PieChartShare/>
          </div>

          <div class="chart"></div>
          
          <div class="chart"></div>
       </div>

    </>
  )
}

export default Dashboard;
