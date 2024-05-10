import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartOverview, PieOverview } from "@/components";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import customAxios from "@/utils/customAxios";
import { formatPrice } from "@/lib/utils";
import { Socket } from "socket.io-client";

export type parkingStats = {
  month: number;
  year: number;
  totalPayment: number;
  totalParking: number;
};

const Overview = ({ socket }: { socket: Socket }) => {
  const [data, setData] = useState<parkingStats[]>([]);
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [currentData, setCurrentData] = useState<parkingStats | null>(null);
  const [lastData, setLastData] = useState<parkingStats | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await customAxios.get("/parking/stats");
      setData(response.data.stats);
      setCurrentData(
        response.data.stats.find(
          (stat: parkingStats) => stat.month === currentMonth
        )
      );
      setLastData(
        response.data.stats.find(
          (stat: parkingStats) => stat.month === currentMonth - 1
        )
      );
    };

    fetchData();
  }, [currentMonth]);

  useEffect(() => {
    socket.on("receiveStats", (data: parkingStats[]) => {
      setData(data);
      setCurrentData(data.find((stat) => stat.month === currentMonth) ?? null);
      setLastData(data.find((stat) => stat.month === currentMonth - 1) ?? null);
    });

    return () => {
      socket.off("receiveStats");
    };
  }, [socket, currentMonth]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData ? formatPrice(currentData.totalPayment) : 0}
            </div>
            {currentData && lastData && (
              <p className="text-xs text-muted-foreground">
                {currentData.totalPayment - lastData.totalPayment > 0 ? (
                  <span className="text-green-500">
                    +
                    {((currentData.totalPayment - lastData.totalPayment) /
                      lastData.totalPayment) *
                      100}
                    % from last month
                  </span>
                ) : (
                  <span className="text-red-500">
                    -
                    {((currentData.totalPayment - lastData.totalPayment) /
                      lastData.totalPayment) *
                      100}
                    % from last month
                  </span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Parking Spots
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData ? currentData.totalParking : 0}
            </div>
            {currentData && lastData && (
              <p className="text-xs text-muted-foreground">
                {currentData.totalParking - lastData.totalParking > 0 ? (
                  <span className="text-green-500">
                    +
                    {((currentData.totalParking - lastData.totalParking) /
                      lastData.totalParking) *
                      100}
                    % from last month
                  </span>
                ) : (
                  <span className="text-red-500">
                    {((currentData.totalParking - lastData.totalParking) /
                      lastData.totalParking) *
                      100}
                    % from last month
                  </span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            {currentData && lastData && (
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+200 % from last month</span>
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData ? currentData.totalParking : 0}
            </div>
            {currentData && lastData && (
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">
                  +
                  {((currentData.totalParking - lastData.totalParking) /
                    lastData.totalParking) *
                    100}
                  % from last month
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className=" md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartOverview data={data} />
          </CardContent>
        </Card>
        <Card className=" md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Parking Slots Overview</CardTitle>
            <CardDescription>Overview of the parking slots</CardDescription>
          </CardHeader>
          <CardContent>
            <PieOverview />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Overview;
