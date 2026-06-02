import { EmptyState } from "@/components/empty-state";
import { Wrench } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="px-12 pb-20 pt-10">
      <EmptyState 
        icon={Wrench}
        title="No services configured"
        description="You haven't listed any services. Add your professional offerings to help clients understand what you do."
        actionLabel="Add Service"
      />
    </div>
  );
}
