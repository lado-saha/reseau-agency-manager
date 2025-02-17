"use client";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

// Enregistrer les composants nécessaires pour Chart.js
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

const VehiculeTab = () => {
  // Données pour les véhicules en service
  const dataVehicles = {
    labels: ["Véhicules en service", "Véhicules hors service"],
    datasets: [
      {
        label: "Nombre de véhicules",
        data: [120, 30], // Exemple: 120 véhicules en service sur 150
        backgroundColor: ["#4CAF50", "#FF3D67"],
      },
    ],
  };

  // Données pour les trajets et taux d'utilisation de la flotte
  const dataTripsUsage = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Nombre de trajets",
        data: [3200, 3400, 3600, 3900, 4200, 4400],
        borderColor: "#3498db",
        fill: false,
      },
      {
        label: "Nombre de passagers ",
        data: [4000, 3500, 4200, 3000, 4500, 4000],
        borderColor: "#e74c3c",
        fill: false,
      },
    ],
  };

  // Données pour les véhicules les plus utilisés
  const dataTopVehicles = {
    labels: ["Véhicule A", "Véhicule B", "Véhicule C"],
    datasets: [
      {
        data: [5200, 4800, 4500],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Données pour la maintenance, incidents, et consommation
  const dataMaintenance = {
    labels: ["Coût maintenance", "Incidents", "Conso carburant"],
    datasets: [
      {
        label: "Statistiques",
        data: [430, 5, 15], // Ex: 430$/véhicule, 5 incidents, 15L/100km
        backgroundColor: ["#FF5733", "#C70039", "#900C3F"],
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Statistiques des Véhicules 🚗</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique des véhicules en service */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Véhicules en Service</h3>
          <Bar data={dataVehicles} />
        </div>

        {/* Graphique des trajets et taux d'utilisation */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Trajets & Utilisation</h3>
          <Line data={dataTripsUsage} />
        </div>

        {/* Graphique des véhicules les plus utilisés */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Top Véhicules Utilisés</h3>
          <Doughnut data={dataTopVehicles} />
        </div>

        {/* Graphique maintenance, incidents, et consommation */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Coût, Incidents & Carburant</h3>
          <Radar data={dataMaintenance} />
        </div>
      </div>
    </div>
  );
};

export default VehiculeTab;
