import { UserManagementTable } from "@/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import customAxios from "@/utils/customAxios";
import { useEffect, useState } from "react";
import { UserManagement } from "@/components";

const Customer = () => {
  const [data, setData] = useState<UserManagement[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await customAxios.get("/user/");
        setData(res.data.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage your users here.</CardDescription>
      </CardHeader>
      <CardContent>
        <UserManagementTable data={data} />
      </CardContent>
    </Card>
  );
};

export default Customer;
