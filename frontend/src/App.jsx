import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {

  BarChart3,

  CheckCircle2,

  ChevronRight,

  CirclePlus,

  CloudSun,

  Database,

  Flower2,

  Leaf,

  Plus,

  RefreshCw,

  Sprout,

  Trash2,

  Tractor,

  TrendingUp,

  X,

  Wheat,

  MapPin,

} from "lucide-react";



import "./App.css";



const API = "http://localhost:8081/api";



function App() {

  const [activePage, setActivePage] = useState("Dashboard");



  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("success");

  const [loading, setLoading] = useState(false);



  // ==============================

  // DATA

  // ==============================



  const [farms, setFarms] = useState([]);

  const [crops, setCrops] = useState([]);

  const [conditions, setConditions] = useState([]);

  const [plantings, setPlantings] = useState([]);

  const [harvests, setHarvests] = useState([]);

  const [totalHarvest, setTotalHarvest] = useState(0);



  // ==============================

  // SELECTIONS

  // ==============================



  const [selectedFarmId, setSelectedFarmId] = useState("");

  const [selectedCropId, setSelectedCropId] = useState("");



  const [selectedRecommendation, setSelectedRecommendation] =

    useState(null);



  const [recommendationLoading, setRecommendationLoading] =

    useState(false);



  // ==============================

  // FORM VISIBILITY

  // ==============================



  const [showFarmForm, setShowFarmForm] = useState(false);

  const [showCropForm, setShowCropForm] = useState(false);

  const [showHarvestForm, setShowHarvestForm] = useState(false);



  // ==============================

  // FARM FORM

  // ==============================



  const [farmForm, setFarmForm] = useState({

    farmName: "",

    totalArea: "",

    location: "",

  });



  // ==============================

  // CROP FORM

  // ==============================



  const [cropForm, setCropForm] = useState({

    cropName: "",

  });



  // ==============================

  // HARVEST FORM

  // ==============================



  const [harvestForm, setHarvestForm] = useState({

    plantingId: "",

    harvestDate: "",

    quantity: "",

  });



  // ==============================

  // SELECTED FARM

  // ==============================



  const selectedFarm = useMemo(() => {

    return farms.find(

      (farm) =>

        String(farm.farmId) === String(selectedFarmId)

    );

  }, [farms, selectedFarmId]);



  // ==============================

  // SELECTED CONDITION

  // ==============================



  const selectedCondition = useMemo(() => {

    return conditions.find(

      (condition) =>

        String(condition.farmId) === String(selectedFarmId)

    );

  }, [conditions, selectedFarmId]);



  // ==============================

  // SELECTED CROP

  // ==============================



  const selectedCrop = useMemo(() => {

    return crops.find(

      (crop) =>

        String(crop.cropId) === String(selectedCropId)

    );

  }, [crops, selectedCropId]);



  // =====================================================
// MESSAGE
// =====================================================

const showMessage = (text, type = "success") => {
  setMessage(text);
  setMessageType(type);

  window.clearTimeout(window.__farmHubMessageTimer);

  window.__farmHubMessageTimer = window.setTimeout(() => {
    setMessage("");
  }, 3500);
};
  // =====================================================

  // LOAD ALL DATA

  // =====================================================



  const loadAllData = async () => {

    setLoading(true);



    try {

      const [

        farmsResponse,

        cropsResponse,

        conditionsResponse,

        plantingsResponse,

        harvestsResponse,

        totalHarvestResponse,

      ] = await Promise.all([

        axios.get(`${API}/farms`),

        axios.get(`${API}/crops`),

        axios.get(`${API}/farm-conditions`),

        axios.get(`${API}/crop-plantings`),

        axios.get(`${API}/harvests`),

        axios.get(`${API}/harvests/total`),

      ]);



      const farmData = farmsResponse.data || [];

      const cropData = cropsResponse.data || [];



      setFarms(farmData);

      setCrops(cropData);



      setConditions(

        conditionsResponse.data || []

      );



      setPlantings(

        plantingsResponse.data || []

      );



      setHarvests(

        harvestsResponse.data || []

      );



      setTotalHarvest(

        Number(totalHarvestResponse.data || 0)

      );



      // Select first farm only when nothing is selected

      setSelectedFarmId((current) => {

        if (

          current &&

          farmData.some(

            (farm) =>

              String(farm.farmId) ===

              String(current)

          )

        ) {

          return current;

        }



        return farmData.length

          ? String(farmData[0].farmId)

          : "";

      });



      // Keep crop selection valid

      setSelectedCropId((current) => {

        if (

          current &&

          cropData.some(

            (crop) =>

              String(crop.cropId) ===

              String(current)

          )

        ) {

          return current;

        }



        return "";

      });

    } catch (error) {

      console.error(

        "Data loading error:",

        error

      );



      showMessage(

        "Backend connection failed. Make sure Spring Boot is running on port 8081.",

        "error"

      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadAllData();

  }, []);



  // Clear recommendation whenever

  // farm or crop changes

  useEffect(() => {

    setSelectedRecommendation(null);

  }, [selectedFarmId, selectedCropId]);



  // =====================================================

  // ADD FARM

  // =====================================================



  const addFarm = async (event) => {

    event.preventDefault();



    if (

      !farmForm.farmName ||

      !farmForm.totalArea ||

      !farmForm.location

    ) {

      showMessage(

        "Please fill all farm fields.",

        "error"

      );

      return;

    }



    try {

      const response = await axios.post(

        `${API}/farms`,

        {

          farmName:

            farmForm.farmName.trim(),



          totalArea:

            Number(farmForm.totalArea),



          location:

            farmForm.location.trim(),

        }

      );



      const newFarm = response.data;



      setFarmForm({

        farmName: "",

        totalArea: "",

        location: "",

      });



      setShowFarmForm(false);



      await loadAllData();



      if (newFarm?.farmId) {

        setSelectedFarmId(

          String(newFarm.farmId)

        );

      }



      showMessage(

        "Farm added successfully."

      );

    } catch (error) {

      console.error(

        "Add farm error:",

        error

      );



      showMessage(

        "Failed to add farm.",

        "error"

      );

    }

  };



  // =====================================================

  // DELETE FARM

  // =====================================================



  const deleteFarm = async (id) => {

    if (!id) return;



    const farm = farms.find(

      (item) =>

        item.farmId === Number(id)

    );



    if (

      !window.confirm(

        `Delete ${

          farm?.farmName || "this farm"

        }?`

      )

    ) {

      return;

    }



    try {

      await axios.delete(

        `${API}/farms/${id}`

      );



      await loadAllData();



      showMessage(

        "Farm deleted successfully."

      );

    } catch (error) {

      console.error(

        "Delete farm error:",

        error

      );



      showMessage(

        "Farm could not be deleted. Remove dependent records first.",

        "error"

      );

    }

  };



  // =====================================================

  // ADD CROP

  // =====================================================



  const addCrop = async (event) => {

    event.preventDefault();



    if (!cropForm.cropName.trim()) {

      showMessage(

        "Enter a crop name.",

        "error"

      );

      return;

    }



    try {

      await axios.post(

        `${API}/crops`,

        {

          cropName:

            cropForm.cropName.trim(),

        }

      );



      setCropForm({

        cropName: "",

      });



      setShowCropForm(false);



      await loadAllData();



      showMessage(

        "Crop added successfully."

      );

    } catch (error) {

      console.error(

        "Add crop error:",

        error

      );



      showMessage(

        "Failed to add crop.",

        "error"

      );

    }

  };



  // =====================================================

  // DELETE CROP

  // =====================================================



  const deleteCrop = async (id) => {

    const crop = crops.find(

      (item) =>

        item.cropId === Number(id)

    );



    if (

      !window.confirm(

        `Delete ${

          crop?.cropName || "this crop"

        }?`

      )

    ) {

      return;

    }



    try {

      await axios.delete(

        `${API}/crops/${id}`

      );



      await loadAllData();



      showMessage(

        "Crop deleted successfully."

      );

    } catch (error) {

      console.error(

        "Delete crop error:",

        error

      );



      showMessage(

        "Crop could not be deleted. Remove dependent records first.",

        "error"

      );

    }

  };



  // =====================================================

  // ADD HARVEST

  // Uses stored procedure endpoint

  // =====================================================



  const recordHarvest = async (event) => {

    event.preventDefault();



    if (

      !harvestForm.plantingId ||

      !harvestForm.harvestDate ||

      !harvestForm.quantity

    ) {

      showMessage(

        "Please fill all harvest fields.",

        "error"

      );

      return;

    }



    try {

      const response = await axios.post(

        `${API}/harvests/record`,

        {

          plantingId:

            Number(harvestForm.plantingId),



          harvestDate:

            harvestForm.harvestDate,



          quantity:

            Number(harvestForm.quantity),

        }

      );



      setHarvestForm({

        plantingId: "",

        harvestDate: "",

        quantity: "",

      });



      setShowHarvestForm(false);



      await loadAllData();



      showMessage(

        response.data ||

          "Harvest recorded successfully."

      );

    } catch (error) {

      console.error(

        "Record harvest error:",

        error

      );



      showMessage(

        "Failed to record harvest. Check the planting and backend procedure.",

        "error"

      );

    }

  };



  // =====================================================

  // DELETE HARVEST

  // =====================================================



  const deleteHarvest = async (id) => {

    if (

      !window.confirm(

        "Delete this harvest record?"

      )

    ) {

      return;

    }



    try {

      const response = await axios.delete(

        `${API}/harvests/${id}`

      );



      await loadAllData();



      showMessage(

        response.data ||

          "Harvest deleted successfully."

      );

    } catch (error) {

      console.error(

        "Delete harvest error:",

        error

      );



      showMessage(

        "Failed to delete harvest.",

        "error"

      );

    }

  };



  // =====================================================

  // LOAD SAVED RECOMMENDATION

  // =====================================================



  const loadSavedRecommendation =

    async (farmId, cropId) => {

      if (!farmId || !cropId) {

        setSelectedRecommendation(null);

        return;

      }



      try {

        const response =

          await axios.get(

            `${API}/recommendations/farm/${farmId}`

          );



        const history =

          Array.isArray(response.data)

            ? response.data

            : [];



        const matching = history

          .filter(

            (item) =>

              String(item.cropId) ===

              String(cropId)

          )

          .sort(

            (a, b) =>

              Number(

                b.recommendationId || 0

              ) -

              Number(

                a.recommendationId || 0

              )

          );



        setSelectedRecommendation(

          matching[0] || null

        );

      } catch (error) {

        console.error(

          "Recommendation history error:",

          error

        );



        setSelectedRecommendation(null);

      }

    };



  // =====================================================

  // GENERATE RECOMMENDATION

  // =====================================================



  const generateRecommendation =

    async () => {

      if (

        !selectedFarmId ||

        !selectedCropId

      ) {

        showMessage(

          "Select a farm and a crop first.",

          "error"

        );

        return;

      }



      setRecommendationLoading(true);



      try {

        const response =

          await axios.post(

            `${API}/recommendations/generate/${selectedFarmId}`

          );



        const topResults =

          Array.isArray(response.data)

            ? response.data

            : [];



        // If selected crop is in the

        // generated top results, use it

        const directMatch =

          topResults.find(

            (item) =>

              String(item.cropId) ===

                String(selectedCropId) ||

              item.cropName ===

                selectedCrop?.cropName

          );



        if (directMatch) {

          setSelectedRecommendation(

            directMatch

          );

        } else {

          // Otherwise get latest saved

          // recommendation for selected crop

          await loadSavedRecommendation(

            selectedFarmId,

            selectedCropId

          );

        }



        showMessage(

          "Recommendation generated successfully."

        );

      } catch (error) {

        console.error(

          "Recommendation generation error:",

          error

        );



        showMessage(

          "Failed to generate recommendation.",

          "error"

        );

      } finally {

        setRecommendationLoading(

          false

        );

      }

    };



  // =====================================================

  // PAGE CHANGE

  // =====================================================



  const handlePageChange = (page) => {

    setActivePage(page);



    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };



  // =====================================================

  // PAGE SELECTOR

  // =====================================================



  const renderPage = () => {

    if (activePage === "Farms") {

      return (

        <FarmsPage

          farms={farms}

          selectedFarmId={selectedFarmId}

          selectedFarm={selectedFarm}

          showForm={showFarmForm}

          setShowForm={

            setShowFarmForm

          }

          form={farmForm}

          setForm={setFarmForm}

          onSubmit={addFarm}

          onDelete={deleteFarm}

          onSelect={setSelectedFarmId}

        />

      );

    }



    if (activePage === "Crops") {

      return (

        <CropsPage

          crops={crops}

          showForm={showCropForm}

          setShowForm={

            setShowCropForm

          }

          form={cropForm}

          setForm={setCropForm}

          onSubmit={addCrop}

          onDelete={deleteCrop}

        />

      );

    }



    if (

      activePage ===

      "Recommendations"

    ) {

      return (

        <RecommendationPage

          farms={farms}

          crops={crops}

          selectedFarmId={

            selectedFarmId

          }

          selectedCropId={

            selectedCropId

          }

          setSelectedFarmId={

            setSelectedFarmId

          }

          setSelectedCropId={

            setSelectedCropId

          }

          selectedFarm={selectedFarm}

          selectedCrop={selectedCrop}

          recommendation={

            selectedRecommendation

          }

          loading={

            recommendationLoading

          }

          onGenerate={

            generateRecommendation

          }

          onRefresh={() =>

            loadSavedRecommendation(

              selectedFarmId,

              selectedCropId

            )

          }

        />

      );

    }



    if (activePage === "Harvests") {

      return (

        <HarvestsPage

          harvests={harvests}

          plantings={plantings}

          farms={farms}

          crops={crops}

          showForm={

            showHarvestForm

          }

          setShowForm={

            setShowHarvestForm

          }

          form={harvestForm}

          setForm={setHarvestForm}

          onSubmit={recordHarvest}

          onDelete={deleteHarvest}

        />

      );

    }



    return (

      <Dashboard

        farms={farms}

        crops={crops}

        plantings={plantings}

        harvests={harvests}

        totalHarvest={totalHarvest}

        selectedFarmId={

          selectedFarmId

        }

        selectedFarm={selectedFarm}

        selectedCondition={

          selectedCondition

        }

        onSelectFarm={

          setSelectedFarmId

        }

        onPageChange={

          handlePageChange

        }

        onRefresh={loadAllData}

        loading={loading}

      />

    );

  };



  // =====================================================

  // MAIN APP

  // =====================================================



  return (

    <div className="app-shell">



      <Sidebar

        activePage={activePage}

        onChange={handlePageChange}

      />



      <div className="main-area">



        {/* TOP BAR */}

        <header className="topbar">



          <div className="breadcrumb">

            <span>FarmHub</span>

            <ChevronRight size={16} />

            <strong>

              {activePage}

            </strong>

          </div>



          <div className="topbar-actions">



            <span className="online-status">

              <span className="online-dot" />

              System Online

            </span>



            <button

              className="icon-button"

              onClick={loadAllData}

              title="Refresh"

              disabled={loading}

            >

              <RefreshCw

                size={19}

                className={

                  loading

                    ? "spin"

                    : ""

                }

              />

            </button>



          </div>

        </header>



        {/* MESSAGE */}

        {message && (

          <div

            className={`toast ${messageType}`}

          >

            {messageType ===

            "success" ? (

              <CheckCircle2

                size={18}

              />

            ) : (

              <X size={18} />

            )}



            <span>

              {message}

            </span>



            <button

              onClick={() =>

                setMessage("")

              }

            >

              <X size={16} />

            </button>

          </div>

        )}



        {renderPage()}

      </div>

    </div>

  );

}





// =======================================================

// SIDEBAR

// =======================================================



function Sidebar({

  activePage,

  onChange,

}) {

  const navItems = [

    {

      name: "Dashboard",

      icon: BarChart3,

    },

    {

      name: "Farms",

      icon: Tractor,

    },

    {

      name: "Crops",

      icon: Sprout,

    },

    {

      name: "Recommendations",

      icon: TrendingUp,

    },

    {

      name: "Harvests",

      icon: Wheat,

    },

  ];



  return (

    <aside className="sidebar">



      <div className="brand-block">



        <div className="brand-icon">

          <Leaf size={30} />

        </div>



        <div>

          <h1>FarmHub</h1>

          <p>Smart Agriculture</p>

        </div>



      </div>



      <div className="sidebar-label">

        MAIN MENU

      </div>



      <nav className="sidebar-nav">



        {navItems.map((item) => {

          const Icon = item.icon;



          return (

            <button

              key={item.name}

              className={`nav-item ${

                activePage === item.name

                  ? "active"

                  : ""

              }`}

              onClick={() =>

                onChange(item.name)

              }

            >

              <Icon size={20} />

              <span>

                {item.name}

              </span>

            </button>

          );

        })}



      </nav>



      <div className="sidebar-bottom">



        <div className="stack-card">



          <div className="stack-title">

            TECH STACK

          </div>



          <div className="stack-pills">

            <span>

              Spring Boot

            </span>

            <span>React</span>

            <span>MySQL</span>

          </div>



        </div>



        <div className="admin-card">



          <div className="admin-avatar">

            MP

          </div>



          <div>

            <strong>

              Farm Admin

            </strong>



            <span>

              Smart Agriculture

            </span>

          </div>



        </div>



      </div>

    </aside>

  );

}





// =======================================================

// PAGE HEADER

// =======================================================



function PageHeader({

  eyebrow,

  title,

  subtitle,

  action,

}) {

  return (

    <div className="page-header">



      <div>



        <div className="eyebrow">

          {eyebrow}

        </div>



        <h2>{title}</h2>



        {subtitle && (

          <p>{subtitle}</p>

        )}



      </div>



      {action}



    </div>

  );

}





// =======================================================

// DASHBOARD

// =======================================================



function Dashboard({

  farms,

  crops,

  plantings,

  harvests,

  totalHarvest,

  selectedFarmId,

  selectedFarm,

  selectedCondition,

  onSelectFarm,

  onPageChange,

  onRefresh,

  loading,

}) {

  const activePlantings =

    plantings.filter(

      (item) =>

        item.status !==

        "HARVESTED"

    ).length;



  return (

    <main className="page-content">



      <PageHeader

        eyebrow="SMART AGRICULTURE"

        title="Farm Dashboard"

        subtitle="Live farm data"

        action={

          <button

            className="secondary-btn"

            onClick={onRefresh}

          >

            <RefreshCw size={17} />

            {loading

              ? "Refreshing..."

              : "Refresh"}

          </button>

        }

      />



      {/* HERO */}

      <section className="hero-card">



        <div>



          <span className="hero-badge">

            <Flower2 size={15} />

            FarmHub Intelligence

          </span>



          <h1>

            Grow smarter.

            <br />

            Harvest better.

          </h1>



          <p>

            One place to manage

            farms, crops,

            recommendations and

            harvests.

          </p>



          <div className="hero-actions">



            <button

              onClick={() =>

                onPageChange(

                  "Farms"

                )

              }

            >

              <Plus size={17} />

              Add Farm

            </button>



            <button

              className="light-btn"

              onClick={() =>

                onPageChange(

                  "Recommendations"

                )

              }

            >

              <TrendingUp

                size={17}

              />

              Crop Recommendation

            </button>



          </div>



        </div>



        <div className="hero-art">

          <Leaf

            size={100}

            strokeWidth={1.5}

          />

          <Sprout

            size={50}

            strokeWidth={1.5}

          />

        </div>



      </section>



      {/* STATS */}

      <section className="stats-grid">



        <StatCard

          icon={

            <Tractor size={23} />

          }

          label="Total Farms"

          value={farms.length}

          tone="green"

          onClick={() =>

            onPageChange(

              "Farms"

            )

          }

        />



        <StatCard

          icon={

            <Sprout size={23} />

          }

          label="Total Crops"

          value={crops.length}

          tone="orange"

          onClick={() =>

            onPageChange(

              "Crops"

            )

          }

        />



        <StatCard

          icon={

            <Flower2 size={23} />

          }

          label="Active Plantings"

          value={activePlantings}

          tone="blue"

          onClick={() =>

            onPageChange(

              "Farms"

            )

          }

        />



        <StatCard

          icon={

            <Wheat size={23} />

          }

          label="Total Harvest"

          value={`${Number(

            totalHarvest || 0

          ).toLocaleString()} kg`}

          tone="purple"

          onClick={() =>

            onPageChange(

              "Harvests"

            )

          }

        />



      </section>



      {/* FARM + CONDITIONS */}

      <section className="dashboard-grid">



        <div className="panel-card">



          <div className="panel-heading">



            <div>

              <div className="eyebrow">

                FARM SELECTION

              </div>



              <h3>

                Select a Farm

              </h3>

            </div>



            <Tractor size={22} />



          </div>



          <select

            className="big-select"

            value={selectedFarmId}

            onChange={(event) =>

              onSelectFarm(

                event.target.value

              )

            }

          >

            <option value="">

              Select farm

            </option>



            {farms.map((farm) => (

              <option

                key={farm.farmId}

                value={

                  farm.farmId

                }

              >

                {farm.farmName}

              </option>

            ))}

          </select>



          {selectedFarm ? (

            <div className="selected-farm-box">



              <div className="selected-farm-icon">

                <Leaf size={24} />

              </div>



              <div>

                <strong>

                  {selectedFarm.farmName}

                </strong>



                <span>

                  <MapPin

                    size={14}

                  />

                  {

                    selectedFarm.location

                  }

                </span>

              </div>



              <div className="farm-area">

                <small>

                  Area

                </small>



                <strong>

                  {

                    selectedFarm.totalArea

                  }

                </strong>



                <span>

                  acres

                </span>

              </div>



            </div>

          ) : (

            <div className="empty-state">

              No farm selected

            </div>

          )}



        </div>





        <div className="panel-card">



          <div className="panel-heading">



            <div>

              <div className="eyebrow">

                FARM CONDITIONS

              </div>



              <h3>

                {selectedFarm

                  ?.farmName ||

                  "Select a Farm"}

              </h3>

            </div>



            <CloudSun size={23} />



          </div>



          {selectedCondition ? (

            <div className="condition-grid">



              <ConditionCard

                icon={

                  <Leaf size={20} />

                }

                label="Soil"

                value={

                  selectedCondition.soilType

                }

                tone="green"

              />



              <ConditionCard

                icon={

                  <CloudSun size={20} />

                }

                label="Water"

                value={

                  selectedCondition.waterAvailability

                }

                tone="blue"

              />



              <ConditionCard

                icon={

                  <Wheat size={20} />

                }

                label="Season"

                value={

                  selectedCondition.season

                }

                tone="orange"

              />



              <ConditionCard

                icon={

                  <TrendingUp

                    size={20}

                  />

                }

                label="Temperature"

                value={`${selectedCondition.temperature}°C`}

                tone="red"

              />



            </div>

          ) : (

            <div className="empty-state">

              No farm conditions

            </div>

          )}



        </div>



      </section>



     {/* HARVEST HISTOGRAM */}
{(() => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const now = new Date();

  const monthlyData = [];

  // Last 12 months
  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const quantity = harvests
      .filter((item) => {
        if (!item.harvestDate) {
          return false;
        }

        const harvestDate = new Date(
          item.harvestDate
        );

        return (
          harvestDate.getFullYear() === year &&
          harvestDate.getMonth() === month
        );
      })
      .reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      );

    monthlyData.push({
      label: monthNames[month],
      year,
      quantity,
    });
  }

  const maxQuantity = Math.max(
    ...monthlyData.map(
      (item) => item.quantity
    ),
    1
  );

  return (
    <section
      className="panel-card"
      style={{
        marginTop: "24px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <div className="eyebrow">
            HARVEST ANALYTICS
          </div>

          <h3
            style={{
              margin: "5px 0 0",
              fontSize: "22px",
            }}
          >
            Harvest Quantity Overview
          </h3>
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#6f8178",
            background: "#edf7f1",
            padding: "8px 12px",
            borderRadius: "999px",
          }}
        >
          Last 12 Months
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(12, minmax(55px, 1fr))",
          gap: "10px",
          overflowX: "auto",
          alignItems: "end",
          minHeight: "260px",
          padding: "10px 4px 0",
        }}
      >
        {monthlyData.map((item) => {
          const barHeight =
            item.quantity === 0
              ? 8
              : Math.max(
                  18,
                  Math.round(
                    (item.quantity /
                      maxQuantity) *
                      190
                  )
                );

          return (
            <div
              key={`${item.label}-${item.year}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "240px",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#214b3c",
                }}
              >
                {item.quantity.toLocaleString()}
              </span>

              <div
                title={`${item.label} ${item.year}: ${item.quantity.toLocaleString()} kg`}
                style={{
                  width: "100%",
                  maxWidth: "54px",
                  height: `${barHeight}px`,
                  borderRadius:
                    "12px 12px 6px 6px",
                  background:
                    "linear-gradient(180deg, #5bb98a 0%, #1d7c55 100%)",
                  boxShadow:
                    "0 8px 18px rgba(29, 124, 85, 0.18)",
                  transition:
                    "height 0.3s ease",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#6d7f76",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
})()}


      {/* QUICK ACTIONS */}

      <section className="quick-grid">



        <QuickAction

          icon={<Tractor />}

          title="Manage Farms"

          value={`${farms.length} farms`}

          onClick={() =>

            onPageChange(

              "Farms"

            )

          }

        />



        <QuickAction

          icon={<Sprout />}

          title="Manage Crops"

          value={`${crops.length} crops`}

          onClick={() =>

            onPageChange(

              "Crops"

            )

          }

        />



        <QuickAction

          icon={

            <TrendingUp />

          }

          title="Recommendations"

          value="Select a crop"

          onClick={() =>

            onPageChange(

              "Recommendations"

            )

          }

        />



        <QuickAction

          icon={<Wheat />}

          title="Harvest Records"

          value={`${harvests.length} records`}

          onClick={() =>

            onPageChange(

              "Harvests"

            )

          }

        />



      </section>



    </main>

  );

}





// =======================================================

// STAT CARD

// =======================================================



function StatCard({

  icon,

  label,

  value,

  tone,

  onClick,

}) {

  return (

    <button

      className={`stat-card ${tone}`}

      onClick={onClick}

    >



      <div className="stat-top">



        <div className="stat-icon-box">

          {icon}

        </div>



        <ChevronRight

          size={18}

        />



      </div>



      <span>{label}</span>



      <strong>{value}</strong>



    </button>

  );

}





// =======================================================

// CONDITION CARD

// =======================================================



function ConditionCard({

  icon,

  label,

  value,

  tone,

}) {

  return (

    <div

      className={`condition-card ${tone}`}

    >



      <div className="condition-icon">

        {icon}

      </div>



      <span>{label}</span>



      <strong>

        {value || "-"}

      </strong>



    </div>

  );

}





// =======================================================

// QUICK ACTION

// =======================================================



function QuickAction({

  icon,

  title,

  value,

  onClick,

}) {

  return (

    <button

      className="quick-card"

      onClick={onClick}

    >



      <div className="quick-icon">

        {icon}

      </div>



      <div>

        <span>{title}</span>

        <strong>{value}</strong>

      </div>



      <ChevronRight

        size={19}

      />



    </button>

  );

}





// =======================================================

// FARMS PAGE

// =======================================================



function FarmsPage({

  farms,

  selectedFarmId,

  selectedFarm,

  showForm,

  setShowForm,

  form,

  setForm,

  onSubmit,

  onDelete,

  onSelect,

}) {

  return (

    <main className="page-content">



      <PageHeader

        eyebrow="FARM MANAGEMENT"

        title="Farms"

        subtitle="Select, add and remove farms"

        action={

          <button

            className="primary-btn"

            onClick={() =>

              setShowForm(

                (current) =>

                  !current

              )

            }

          >

            {showForm ? (

              <X size={18} />

            ) : (

              <Plus size={18} />

            )}



            {showForm

              ? "Close"

              : "Add Farm"}

          </button>

        }

      />



      <section className="management-layout">



        {/* FARM SELECTOR */}

        <div className="panel-card">



          <div className="panel-heading">



            <div>

              <div className="eyebrow">

                FARM SELECTOR

              </div>



              <h3>

                Choose a Farm

              </h3>

            </div>



            <Database

              size={22}

            />



          </div>



          <select

            className="big-select"

            value={

              selectedFarmId

            }

            onChange={(event) =>

              onSelect(

                event.target.value

              )

            }

          >

            <option value="">

              Select farm

            </option>



            {farms.map((farm) => (

              <option

                key={farm.farmId}

                value={

                  farm.farmId

                }

              >

                {farm.farmName}

              </option>

            ))}

          </select>



          {selectedFarm ? (

            <div className="farm-profile">



              <div className="profile-icon">

                <Leaf

                  size={31}

                />

              </div>



              <h3>

                {selectedFarm.farmName}

              </h3>



              <div className="profile-row">



                <span>

                  <MapPin

                    size={15}

                  />

                  Location

                </span>



                <strong>

                  {

                    selectedFarm.location

                  }

                </strong>



              </div>



              <div className="profile-row">



                <span>

                  <Tractor

                    size={15}

                  />

                  Area

                </span>



                <strong>

                  {

                    selectedFarm.totalArea

                  }{" "}

                  acres

                </strong>



              </div>



              <button

                className="danger-btn full-width"

                onClick={() =>

                  onDelete(

                    selectedFarm.farmId

                  )

                }

              >

                <Trash2

                  size={17}

                />

                Delete Selected Farm

              </button>



            </div>

          ) : (

            <div className="empty-state large">

              Select a farm

            </div>

          )}



        </div>



        {/* ADD FARM */}

        {showForm && (

          <div className="panel-card form-panel">



            <div className="panel-heading">



              <div>

                <div className="eyebrow">

                  NEW FARM

                </div>



                <h3>

                  Add Farm

                </h3>

              </div>



              <CirclePlus

                size={22}

              />



            </div>



            <form

              className="smart-form"

              onSubmit={onSubmit}

            >



              <FormField

                label="Farm Name"

                value={

                  form.farmName

                }

                onChange={(value) =>

                  setForm(

                    (current) => ({

                      ...current,

                      farmName:

                        value,

                    })

                  )

                }

                placeholder="Enter farm name"

              />



              <FormField

                label="Total Area"

                type="number"

                value={

                  form.totalArea

                }

                onChange={(value) =>

                  setForm(

                    (current) => ({

                      ...current,

                      totalArea:

                        value,

                    })

                  )

                }

                placeholder="Area in acres"

              />



              <FormField

                label="Location"

                value={

                  form.location

                }

                onChange={(value) =>

                  setForm(

                    (current) => ({

                      ...current,

                      location:

                        value,

                    })

                  )

                }

                placeholder="Enter location"

              />



              <button

                className="primary-btn full-width"

                type="submit"

              >

                <Plus size={17} />

                Save Farm

              </button>



            </form>

          </div>

        )}



      </section>

    </main>

  );

}





// =======================================================

// CROPS PAGE

// =======================================================



function CropsPage({

  crops,

  showForm,

  setShowForm,

  form,

  setForm,

  onSubmit,

  onDelete,

}) {

  return (

    <main className="page-content">



      <PageHeader

        eyebrow="CROP MANAGEMENT"

        title="Crops"

        subtitle="Add and delete crop records"

        action={

          <button

            className="primary-btn"

            onClick={() =>

              setShowForm(

                (current) =>

                  !current

              )

            }

          >

            {showForm ? (

              <X size={18} />

            ) : (

              <Plus size={18} />

            )}



            {showForm

              ? "Close"

              : "Add Crop"}

          </button>

        }

      />



      {showForm && (

        <div className="panel-card form-panel crop-form-panel">



          <div className="panel-heading">



            <div>

              <div className="eyebrow">

                NEW CROP

              </div>



              <h3>

                Add Crop

              </h3>

            </div>



            <Sprout

              size={23}

            />



          </div>



          <form

            className="inline-form"

            onSubmit={onSubmit}

          >



            <input

              className="form-input"

              type="text"

              value={

                form.cropName

              }

              onChange={(event) =>

                setForm({

                  cropName:

                    event.target

                      .value,

                })

              }

              placeholder="Crop name"

              required

            />



            <button

              className="primary-btn"

              type="submit"

            >

              <Plus size={17} />

              Save Crop

            </button>



          </form>

        </div>

      )}



      <section className="crop-grid">



        {crops.length === 0 ? (

          <div className="panel-card empty-state large">

            No crop records

          </div>

        ) : (

          crops.map((crop) => (

            <div

              className="crop-card"

              key={crop.cropId}

            >



              <div className="crop-card-top">



                <div className="crop-icon">

                  <Sprout

                    size={25}

                  />

                </div>



                <button

                  className="icon-danger"

                  title="Delete crop"

                  onClick={() =>

                    onDelete(

                      crop.cropId

                    )

                  }

                >

                  <Trash2

                    size={18}

                  />

                </button>



              </div>



              <div className="crop-id">

                CROP #

                {crop.cropId}

              </div>



              <h3>

                {crop.cropName}

              </h3>



              <div className="crop-footer">

                <span>

                  Crop Record

                </span>



                <CheckCircle2

                  size={17}

                />

              </div>



            </div>

          ))

        )}



      </section>



    </main>

  );

}





// =======================================================
// RECOMMENDATION PAGE
// =======================================================

function RecommendationPage({
  farms,
  crops,
  selectedFarmId,
  selectedCropId,
  setSelectedFarmId,
  setSelectedCropId,
  selectedFarm,
  selectedCrop,
  recommendation,
  loading,
  onGenerate,
  onRefresh,
}) {
  return (
    <main className="page-content">

      <PageHeader
        eyebrow="SMART DECISION SUPPORT"
        title="Crop Recommendation"
        subtitle="Select one farm and one crop"
        action={
          <button
            className="secondary-btn"
            onClick={onRefresh}
          >
            <RefreshCw size={17} />
            Load Saved
          </button>
        }
      />

      <section className="recommendation-layout">

        {/* CONTROLS */}
        <div className="panel-card recommendation-controls">

          <div className="control-step">
            <span className="step-number">1</span>
            <div>
              <div className="eyebrow">FARM</div>
              <h3>Select Farm</h3>
            </div>
          </div>

          <select
            className="big-select"
            value={selectedFarmId}
            onChange={(event) =>
              setSelectedFarmId(event.target.value)
            }
          >
            <option value="">Select farm</option>

            {farms.map((farm) => (
              <option
                key={farm.farmId}
                value={farm.farmId}
              >
                {farm.farmName}
              </option>
            ))}
          </select>

          <div className="control-divider" />

          <div className="control-step">
            <span className="step-number">2</span>
            <div>
              <div className="eyebrow">CROP</div>
              <h3>Select Crop</h3>
            </div>
          </div>

          <select
            className="big-select"
            value={selectedCropId}
            onChange={(event) =>
              setSelectedCropId(event.target.value)
            }
          >
            <option value="">Select crop</option>

            {crops.map((crop) => (
              <option
                key={crop.cropId}
                value={crop.cropId}
              >
                {crop.cropName}
              </option>
            ))}
          </select>

          <button
            className="primary-btn full-width recommendation-button"
            onClick={onGenerate}
            disabled={
              loading ||
              !selectedFarmId ||
              !selectedCropId
            }
          >
            <TrendingUp size={18} />
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>

        </div>

        {/* RESULT */}
        <div className="panel-card recommendation-result">

          <div className="result-top">
            <div>
              <div className="eyebrow">RESULT</div>
              <h3>
                {selectedCrop?.cropName || "Select a Crop"}
              </h3>
            </div>

            <div className="result-badge">
              <Leaf size={18} />
              {selectedFarm?.farmName || "No Farm"}
            </div>
          </div>

          {!selectedFarmId && !selectedCropId ? (
            <div className="no-result-box">
              <div className="no-result-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Select a farm and crop</h3>
              <p>Select the farm and crop you want to analyze.</p>
            </div>
          ) : !selectedCropId ? (
            <div className="no-result-box">
              <div className="no-result-icon">
                <Sprout size={28} />
              </div>
              <h3>Select a crop</h3>
              <p>Choose one crop to view its recommendation.</p>
            </div>
          ) : recommendation ? (
            <RecommendationCard
              recommendation={recommendation}
              cropName={selectedCrop?.cropName}
            />
          ) : (
            <div className="no-result-box">
              <div className="no-result-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Ready for analysis</h3>
              <p>Generate the recommendation for the selected crop.</p>
              <button
                className="primary-btn"
                onClick={onGenerate}
                disabled={loading}
              >
                <TrendingUp size={17} />
                {loading ? "Analyzing..." : "Generate Now"}
              </button>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}


// =======================================================

// RECOMMENDATION CARD

// =======================================================



function RecommendationCard({

  recommendation,

  cropName,

}) {

  const score = Number(

    recommendation.suitabilityScore ||

      0

  );



  const status =

    recommendation.recommendationStatus ||

    "NOT AVAILABLE";



  const statusClass = status

    .toLowerCase()

    .replaceAll(" ", "-");



  return (

    <div className="recommendation-card">



      <div className="recommendation-main">



        <div className="recommendation-icon">

          <Sprout size={39} />

        </div>



        <div>



          <span className="recommendation-label">

            SELECTED CROP

          </span>



          <h2>

            {

              cropName ||

              recommendation.cropName

            }

          </h2>



          <span

            className={`status-chip ${statusClass}`}

          >

            {status}

          </span>



        </div>

      </div>



      <div className="score-block">



        <div

          className="score-ring"

          style={{

            "--score": `${score}%`,

          }}

        >

          <div>

            <strong>

              {score}

            </strong>



            <span>

              /100

            </span>

          </div>

        </div>



        <div className="score-caption">

          Suitability Score

        </div>



      </div>



      <div className="score-bar">

        <div

          style={{

            width: `${Math.min(

              100,

              Math.max(

                0,

                score

              )

            )}%`,

          }}

        />

      </div>



      <div className="recommendation-details">



        <div>

          <span>Farm</span>



          <strong>

            {

              recommendation.farmId

            }

          </strong>

        </div>



        <div>

          <span>Date</span>



          <strong>

            {

              recommendation.recommendationDate ||

              "-"

            }

          </strong>

        </div>



      </div>



    </div>

  );

}





// =======================================================

// HARVEST PAGE

// =======================================================



function HarvestsPage({

  harvests,

  plantings,

  farms,

  crops,

  showForm,

  setShowForm,

  form,

  setForm,

  onSubmit,

  onDelete,

}) {

  const getPlantingLabel =

    (plantingId) => {

      const planting =

        plantings.find(

          (item) =>

            String(

              item.plantingId

            ) ===

            String(plantingId)

        );



      if (!planting) {

        return `Planting #${plantingId}`;

      }



      const farm =

        farms.find(

          (item) =>

            String(

              item.farmId

            ) ===

            String(

              planting.farmId

            )

        );



      const crop =

        crops.find(

          (item) =>

            String(

              item.cropId

            ) ===

            String(

              planting.cropId

            )

        );



      return `${

        crop?.cropName ||

        `Crop #${planting.cropId}`

      } • ${

        farm?.farmName ||

        `Farm #${planting.farmId}`

      }`;

    };



  return (

    <main className="page-content">



      <PageHeader

        eyebrow="HARVEST MANAGEMENT"

        title="Harvests"

        subtitle="Record and remove harvest entries"

        action={

          <button

            className="primary-btn"

            onClick={() =>

              setShowForm(

                (current) =>

                  !current

              )

            }

          >

            {showForm ? (

              <X size={18} />

            ) : (

              <Plus size={18} />

            )}



            {showForm

              ? "Close"

              : "Add Harvest"}

          </button>

        }

      />



      {/* ADD HARVEST */}

      {showForm && (

        <div className="panel-card form-panel harvest-form-panel">



          <div className="panel-heading">



            <div>

              <div className="eyebrow">

                NEW HARVEST

              </div>



              <h3>

                Record Harvest

              </h3>

            </div>



            <Wheat

              size={23}

            />



          </div>



          <form

            className="form-grid-3"

            onSubmit={onSubmit}

          >



            <div className="field-group">



              <label>

                Planting

              </label>



              <select

                className="form-input"

                value={

                  form.plantingId

                }

                onChange={(event) =>

                  setForm(

                    (current) => ({

                      ...current,

                      plantingId:

                        event.target

                          .value,

                    })

                  )

                }

                required

              >



                <option value="">

                  Select planting

                </option>



                {plantings.map(

                  (planting) => (

                    <option

                      key={

                        planting.plantingId

                      }

                      value={

                        planting.plantingId

                      }

                    >

                      #

                      {

                        planting.plantingId

                      }{" "}

                      —{" "}

                      {getPlantingLabel(

                        planting.plantingId

                      )}

                    </option>

                  )

                )}



              </select>

            </div>



            <div className="field-group">



              <label>

                Harvest Date

              </label>



              <input

                className="form-input"

                type="date"

                value={

                  form.harvestDate

                }

                onChange={(event) =>

                  setForm(

                    (current) => ({

                      ...current,

                      harvestDate:

                        event.target

                          .value,

                    })

                  )

                }

                required

              />



            </div>



            <div className="field-group">



              <label>

                Quantity (kg)

              </label>



              <input

                className="form-input"

                type="number"

                min="0"

                step="0.01"

                value={

                  form.quantity

                }

                onChange={(event) =>

                  setForm(

                    (current) => ({

                      ...current,

                      quantity:

                        event.target

                          .value,

                    })

                  )

                }

                placeholder="Enter quantity"

                required

              />



            </div>



            <div className="form-submit-row">



              <button

                className="primary-btn"

                type="submit"

              >

                <Wheat

                  size={17}

                />

                Save Harvest

              </button>



            </div>



          </form>

        </div>

      )}



      {/* HARVEST TABLE */}

      <div className="table-card">



        <div className="table-header">



          <div>

            <div className="eyebrow">

              HARVEST RECORDS

            </div>



            <h3>

              {harvests.length}{" "}

              records

            </h3>

          </div>



        </div>



        {harvests.length === 0 ? (

          <div className="empty-state large">

            No harvest records

          </div>

        ) : (

          <div className="table-wrap">



            <table>



              <thead>



                <tr>

                  <th>ID</th>

                  <th>Planting</th>

                  <th>Harvest Date</th>

                  <th>Quantity</th>

                  <th>Action</th>

                </tr>



              </thead>



              <tbody>



                {harvests.map(

                  (harvest) => (

                    <tr

                      key={

                        harvest.harvestId

                      }

                    >



                      <td>

                        <span className="id-pill">

                          #

                          {

                            harvest.harvestId

                          }

                        </span>

                      </td>



                      <td>

                        {getPlantingLabel(

                          harvest.plantingId

                        )}

                      </td>



                      <td>

                        {

                          harvest.harvestDate

                        }

                      </td>



                      <td>

                        <strong>

                          {Number(

                            harvest.quantity

                          ).toLocaleString()}{" "}

                          kg

                        </strong>

                      </td>



                      <td>



                        <button

                          className="icon-danger"

                          title="Delete harvest"

                          onClick={() =>

                            onDelete(

                              harvest.harvestId

                            )

                          }

                        >

                          <Trash2

                            size={18}

                          />

                        </button>



                      </td>



                    </tr>

                  )

                )}



              </tbody>

            </table>



          </div>

        )}



      </div>

    </main>

  );

}





// =======================================================

// FORM FIELD

// =======================================================



function FormField({

  label,

  value,

  onChange,

  placeholder,

  type = "text",

}) {

  return (

    <div className="field-group">



      <label>{label}</label>



      <input

        className="form-input"

        type={type}

        value={value}

        onChange={(event) =>

          onChange(

            event.target.value

          )

        }

        placeholder={

          placeholder

        }

        min={

          type === "number"

            ? "0"

            : undefined

        }

        step={

          type === "number"

            ? "0.01"

            : undefined

        }

        required

      />



    </div>

  );

}



export default App;