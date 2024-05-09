import { PaymentTable } from "@/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
const Payment = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          You made a total of $10,000 in sales this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentTable />
      </CardContent>
    </Card>
  );
};

export default Payment;
