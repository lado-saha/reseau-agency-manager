// GeneralTab.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Pie, Radar } from "react-chartjs-2";
import { dataBar, dataPie, dataRadar } from "./chartData";

const MetricsSummary = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">$45,231.89</h2>
        <p className="text-green-500">+20.1% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">+2350</h2>
        <p className="text-green-500">+180.1% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">+12,234</h2>
        <p className="text-green-500">+19% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Active Now</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">+573</h2>
        <p className="text-green-500">+201 since last hour</p>
      </CardContent>
    </Card>
  </div>
);

const GeneralTab = () => (
    <div>
      <MetricsSummary />
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={dataBar} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={dataPie} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <Radar data={dataRadar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
  

export default GeneralTab;
