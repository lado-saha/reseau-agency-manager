"use client"
// Dashboard.tsx



import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GeneralTab from "@/components/dashboard/GeneralTab";
import VehiculeTab from "@/components/dashboard/VehiculeTab";
import BilanTab from "@/components/dashboard/BilanTab";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,  // 🔥 Ajouté pour les graphiques Pie et Doughnut
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import EmployeesTab from "@/components/dashboard/EmployeesTab";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,  // 🔥 Ajouté ici aussi
  RadialLinearScale,
  PointElement,
  LineElement
);

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button>Download</Button>
      </div>
      <Tabs defaultValue="general" className="mt-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="vehicule">Vehicule</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="bilan">Bilan</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
        <TabsContent value="vehicule">
          <VehiculeTab />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeesTab />
        </TabsContent>
        <TabsContent value="bilan">
          <BilanTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
