import { useState, useEffect, useCallback } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import AddIcon from '@mui/icons-material/Add';

export default function QueryTable(props) {

  const { queryFoodData, tempTestingData, setFoodMacro, foodMacro, showAlert, 
    setShowAlert, setFoodMacroSum, setFixedFoodData, fixedFoodData, datePickerString} = props;

  const [gridData, setGridData] = useState([]);

  //set serving size and change grid data
  const [servingSize, setServingSize] = useState(1);

  function cleanQueryFoodData(foodData) {
    setGridData([])
    const foodDataCleaned = [];
    foodData.forEach((value, index) => {
        const newFood = {
          id : value["fdcId"],
          brand: "",
          food: "",
          protein: "",
          fat: "",
          carb: "",
          caloires: "",
          perserving:"",
          servingunit:"",
          servingSize:"1"


        }

        if (value["foodNutrients"] && value["servingSize"] && value["servingSizeUnit"]) {
        
          newFood["brand"] = value["brandName"]
          newFood["food"] = value["description"]
          value["foodNutrients"].forEach((nutrient, index) => {
            if (nutrient["nutrientId"] === 1003) {
              newFood["protein"] = nutrient["value"]
            }
            if (nutrient["nutrientId"] === 1004) {
              newFood["fat"] = nutrient["value"]
            }
            if (nutrient["nutrientId"] === 1005) {
              newFood["carb"] = nutrient["value"]
            }
            if (nutrient["nutrientId"] === 1008) {
              newFood["calories"] = nutrient["value"]
            }
          })

          newFood["perserving"] = value["servingSize"]
          newFood["servingunit"] = value["servingSizeUnit"]

          foodDataCleaned.push(newFood)
        }
      })
      return foodDataCleaned
  }
  

  useEffect(() => {
    const data = cleanQueryFoodData(queryFoodData);
    setGridData(data);
  }, [queryFoodData])
  

  const processRowUpdate = useCallback(
    (newRow) => {
        if (newRow.servingSize > 0) {
          let updatedRow = {...newRow, 
            carb: newRow.carb * newRow.servingSize,
            fat: newRow.fat * newRow.servingSize,
            protein: newRow.protein * newRow.servingSize,
            calories: newRow.calories * newRow.servingSize,
          }
          console.log("updated row", updatedRow);
          const updateRow = {...updatedRow, isNew:true}
          // setGridData((prev) => {
          //   prev.forEach(food => {
          //     if (food.id === newRow.id) {
  
          //     }
          //   })
          // })
  
          return updateRow;
        } else {
          return {...newRow, isNew:false}
        }
      }, []
  )

  const addItem = useCallback(
    (params) => {
      setTimeout(() => {
        // const addItemData = gridData.filter((row) => {
        //   console.log(row, row.id, id, row.id === id)
        //   return row.id === id
        // });
        if (!(params.row.servingSize > 0)) {
          setShowAlert((prev) => { return {...prev, message:"Please Specify Serving Size", open: true}})
        }else if (!foodMacro.some(obj => obj.id === params.id)) {
          console.log("params row clg",params.row)
          setFoodMacro(prev => [...prev, params.row])
          setFixedFoodData(prev => {
            if (prev[datePickerString])
              return {...prev, [datePickerString]: [...prev[datePickerString],params.row]}
            else {
              return {...prev, [datePickerString]: [params.row]}
            }
          })
          setShowAlert((prev) => { return {...prev, message:"Added Item", open: true}})
          // setFoodMacroSum(foodMacro)
        } else {
          setShowAlert((prev) => { return {...prev, message:"Item Already Exists", open: true}})
        }
      });
    },
    [setFoodMacro, setShowAlert, foodMacro, datePickerString, setFixedFoodData],
  );

  const columns = [
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "food", headerName: "Food", flex: 1 },
    { field: "carb",
      headerName: "Carb", 
      flex: 1,
      // valueGetter: (params) => params.row.carb * params.row.servingSize 
    },
    { field: "protein", 
    headerName: "Protein", 
    flex: 1,
    // valueGetter: (params) => params.row.protein * params.row.servingSize 
  },
    { field: "fat", 
    headerName: "Fat", 
    flex: 1 ,
    // valueGetter: (params) => params.row.fat * params.row.servingSize 
  },
    { field: "calories", 
    headerName: "Calories", 
    flex: 1 ,
    // valueGetter: (params) => params.row.calories * params.row.servingSize 
  },
    { field: "perserving", 
    headerName: "Per Serving", 
    flex: 1 ,
  },
    { field: "servingunit", 
    headerName: "Serving Unit", 
    flex: 1 ,
  },
    { field: "servingSize", 
    headerName: "Serving Size", 
    editable: true,
    flex: 1,
  },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      headerName: "Add Item",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<AddIcon />}
          label="Add Item"
          onClick={() => {
            addItem(params)
          }}
        />,
      ],
    },
  ]

  return (
    <DataGrid
      rows={gridData}
      columns={columns}
      pageSize={100}
      // getRowId={(row) => row.id}
      processRowUpdate={processRowUpdate}
      experimentalFeatures={{ newEditingApi: true }}
    />
  )
}