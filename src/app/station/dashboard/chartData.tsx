// chartData.tsx
export const dataBar = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [{
      label: "Revenue(Fcfa)",
      data: [3000000, 4500000, 6000000, 1500000, 5000000],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    }],
  };
  
  export const dataPie = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [{
      label: "Sales Distribution",
      data: [4000, 3000, 5000],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    }],
  };
  
  export const dataRadar = {
    labels: ["Quality", "Service", "Price", "Design", "Speed"],
    datasets: [{
      label: "Customer Satisfaction",
      data: [5, 4, 3, 4, 5],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    }],
  };
  