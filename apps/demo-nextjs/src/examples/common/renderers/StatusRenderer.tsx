import { ReactNode } from "react";

import type { DemoRow, Status } from "@/src/data/demoData";
import type { CellRendererParams } from "@omnigrid/react";

const STATUS_LABELS: Record<Status, string> = {
    active: "Active",
    pending: "Pending",
    blocked: "Blocked",
    archived: "Archived",
};

const STATUS_COLORS: Record<Status, string> = {
    active: "#05AD98",
    pending: "#878787",
    blocked: "#C05050",
    archived: "#BBBFBF",
};

function resolveStatus(value: unknown): Status {
    return typeof value === "string" && value in STATUS_LABELS ? (value as Status) : "archived";
}

/**
 * Custom status cell renderer for the React adapter example.
 */
export function StatusRenderer({ value }: CellRendererParams<DemoRow>): ReactNode {
    const status = resolveStatus(value);
    const color = STATUS_COLORS[status];
    const label = STATUS_LABELS[status];

    return (
        <span
            style={{
                alignItems: "center",
                display: "inline-flex",
                gap: 6,
                paddingLeft: 8,
                whiteSpace: "nowrap",
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    backgroundColor: color,
                    borderRadius: "50%",
                    display: "inline-block",
                    height: 8,
                    width: 8,
                }}
            />
            {label}
        </span>
    );
}
