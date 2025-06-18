import DriverComparison from "@/components/DriverComparison";

export const metadata = {
  title: "Driver Comparison",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Comparison</h1>
      <DriverComparison />
    </main>
  );
}
