import { notFound } from "next/navigation";
import AppProvider from "@/provider/AppProvider";
import TableBase from "@/screens/menu/TableBase";
import { TableUnavailable } from "@/ui/TableUnavailable";
import { getTable } from "@/models/restaurantTable/services";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function TablePage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.token) {
    notFound();
  }

  const tableData = await getTable(resolvedParams.token);

  if (!tableData) {
    notFound();
  }


  // Show unavailable if either cashier or waiter is missing
  if (!tableData.cashierId || !tableData.waiterId || tableData.status != "AVAILABLE") {
    return <TableUnavailable tableName={tableData.tableName} tableNumber={tableData.tableNumber} />;
  }

  return (
    <AppProvider>
      <TableBase tableData={tableData} />
    </AppProvider>
  );
}