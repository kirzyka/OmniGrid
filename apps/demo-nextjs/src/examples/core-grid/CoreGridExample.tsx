"use client";

import { useSpeedingTicketsDS } from "@/src/data/dataService";
import { speedTicketsMColDefs } from "@/src/examples/common/colDefs/speedTicketsMColDefs";
import { OmniGrid } from "@omnigrid/react";

export function CoreGridExample() {
    const data = useSpeedingTicketsDS();

    return <OmniGrid columns={speedTicketsMColDefs} data={data} style={{ height: "100%", width: "100%" }} />;
}
