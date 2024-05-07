import { ManagementTable, Management as ParkingManagement } from "@/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Parking } from "@/interfaces";
import customAxios from "@/utils/customAxios";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface ManagementProps {
  socket: Socket;
}

const Management = ({ socket }: ManagementProps) => {
  const [data, setData] = useState<ParkingManagement[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkings: ParkingManagement[] = [];
        const res = await customAxios.get("/parking/");
        res.data.parkings.map((parking: Parking) => {
          parkings.push(parking);
        });

        setData(parkings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.on("receiveParking", (data: ParkingManagement[]) => {
      setData(data);
    });

    return () => {
      socket.off("receiveParking");
    };
  }, [socket]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Management</CardTitle>
        <CardDescription>Overview of all transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ManagementTable data={data} />
      </CardContent>
    </Card>
  );
};

export default Management;
