"use client";

import UnitList from "@/components/UnitList";
import { LayoutDashboard } from "lucide-react";
import CreateUnitDialog from "@/components/ui/CreateUnitDialog";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">
          <LayoutDashboard className="inline-block mr-2" size={56} />
          Unit Management Dashboard
        </h1>
        <UnitList onOpenCreateUnit={() => setIsOpen(true)} />
        <CreateUnitDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </main>
    </div>
  );
}
