"use client";
import { useState, useEffect } from "react";
import { Bar, Line, Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const EmployeesTab = () => {
  const [chartSize, setChartSize] = useState(400);
  const [isColumnLayout, setIsColumnLayout] = useState(false);

  // Ajuster la taille des graphiques et la disposition des cartes
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setChartSize(width < 640 ? 250 : width < 1024 ? 350 : 400);
      setIsColumnLayout(width < 1140);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Options pour rendre les graphiques fluides et adaptables
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Données des graphiques 📊
  const dataEmployees = {
    labels: ["Employés actifs", "Postes vacants"],
    datasets: [
      {
        label: "Nombre d'employés",
        data: [250, 20],
        backgroundColor: ["#4CAF50", "#FF3D67"],
      },
    ],
  };

  const dataAbsenteeism = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      { label: "Absentéisme (%)", data: [4.5, 4.8, 5.4, 4.7, 4.7, 5.0, 4.3, 4.8, 5.4, 4.7, 3.8, 5.0], borderColor: "#e74c3c" },
    ],
  };

  const dataTurnover = {
    labels: ["Taux de rotation"],
    datasets: [
      {
        data: [33.4, 96.6],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const dataPerformance = {
    labels: ["Heures de travail", "Recrutements", "Satisfaction"],
    datasets: [
      {
        label: "Statistiques",
        data: [38, 12, 4.3],
        backgroundColor: ["#FF5733", "#C70039", "#900C3F"],
      },
    ],
  };

  return (
    <div className="p-4 mt-5">
      <h2 className="text-xl font-bold mb-4">Statistiques des Employés </h2>

      <div className={`grid ${isColumnLayout ? "grid-cols-1" : "grid-cols-2"} gap-6`}>
        {/* Nombre total d’employés */}
        <div className="bg-white p-4 shadow-lg rounded-lg ">
          <h3 className="text-lg font-semibold mb-2">Nombre d’Employés</h3>
          <div style={{ width: chartSize, height: chartSize }}>
            <Bar data={dataEmployees} options={chartOptions} />
          </div>
        </div>

        {/* Taux d’absentéisme */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Taux d’Absentéisme</h3>
          <div style={{ width: chartSize, height: chartSize }}>
            <Line data={dataAbsenteeism} options={chartOptions} />
          </div>
        </div>

        {/* Taux de rotation des employés */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Taux de Rotation</h3>
          <div style={{ width: chartSize, height: chartSize }}>
            <Doughnut data={dataTurnover} options={chartOptions} />
          </div>
        </div>

        {/* Heures de travail, recrutements et performance */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Performance & Recrutements</h3>
          <div style={{ width: chartSize, height: chartSize }}>
            <PolarArea data={dataPerformance} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesTab;
