import React from "react";
import { Analytics, Overview } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Reports
        </TabsTrigger>
        <TabsTrigger value="notifications" disabled>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Overview />
      </TabsContent>
      <TabsContent value="analytics">
        <Analytics />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
