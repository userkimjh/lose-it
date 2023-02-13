import { useState } from "react";
import { Box } from "@mui/material";

import "./App.css";

import WeightDisplay from "./components/WeightDisplay/WeightDisplay";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import FoodDisplay from "./components/FoodDisplay/FoodDisplay";

//Functions needed to created dummy data

const max = 90;
const min = 60;


const testingWeightValue = Array.from({ length: 100 }, () =>
Math.floor(Math.random() * (max - min) + min)
);
const addDays = function (days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const values = testingWeightValue.map((int, index) => {
  return { x: addDays(index), y: int };
});


function App() {
  const drawerWidth = 240;
  const [showPage, SetShowPage] = useState("DASHBOARD");
  
  const [fixedData, setFixedData] = useState(values);
  const [weightData, setWeightData] = useState(values);
  //Setting Calandar date
  const [value, setValue] = useState(new Date());

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar name={"John Kim"} drawerWidth={drawerWidth} />
      {showPage === "DASHBOARD" &&
        <Dashboard 
          drawerWidth={drawerWidth}
          value={value}
          weightData={weightData}
          setWeightData={setWeightData}
          fixedData={fixedData}
        />
      }
      {showPage === "WEIGHT" && 
        <WeightDisplay 
          drawerWidth={drawerWidth}
          fixedData={fixedData}
          setFixedData={setFixedData}
          weightData={weightData}
          setWeightData={setWeightData}
          value={value}
          setValue={setValue}
        />
      }
      {showPage === "FOOD" && <FoodDisplay drawerWidth={drawerWidth} />}
    </Box>
  );
}

export default App;
