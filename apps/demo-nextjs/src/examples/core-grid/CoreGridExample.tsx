"use client";

import { useEffect, useMemo, useState } from "react";

import { DatasetResult, getDemoDataset } from "@/src/data/dataService";
import { SpeedingTicketRow } from "@/src/data/types";
import { ColumnDef, OmniGrid } from "@omnigrid/react";

export function CoreGridExample() {
    const [data, setData] = useState<SpeedingTicketRow[]>([]);
    const colDefs: ColumnDef<SpeedingTicketRow>[] = useMemo(
        () => [
            { id: "ticketId", field: "ticketId", header: "ID", width: 110 },
            { id: "pilotName", field: "pilotName", header: "Pilot", flex: 1, minWidth: 150 },
            { id: "vehicleType", field: "vehicleType", header: "Vehicle", flex: 1, minWidth: 150 },
            { id: "sector", field: "sector", header: "Sector", flex: 1, minWidth: 150 },
            { id: "speedKmh", field: "speedKmh", header: "Speed", align: "right", width: 130 },
            //{ id: "excuse", field: "excuse", header: "Excuse", flex: 1, minWidth: 150 },
            { id: "fineCredits", field: "fineCredits", header: "Fine", align: "right", width: 130 },
        ],
        [],
    );

    useEffect(() => {
        getDemoDataset("speedingTickets", { limit: 50 }).then((data: DatasetResult) => {
            setData(data as SpeedingTicketRow[]);
        });
    }, []);

    return <OmniGrid columns={colDefs} data={data} style={{ height: "100%", width: "100%" }} />;
}
