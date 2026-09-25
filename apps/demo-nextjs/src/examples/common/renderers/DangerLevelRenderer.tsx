import { ReactNode } from "react";

import { AlchemyRow } from "@/src/data/types";
import type { CellRendererParams } from "@omnigrid/react";

const LEVEL_LABELS: Record<number, string> = {
    1: "Mild",
    2: "Spicy",
    3: "Nasty",
    4: "Deadly",
    5: "Doomed",
};

const LEVEL_COLORS: Record<number, string> = {
    1: "#42B66E",
    2: "#A7E090",
    3: "#DFC450",
    4: "#C05050",
    5: "#5E0E0E",
};

export function DangerLevelRenderer({ value }: CellRendererParams<AlchemyRow>): ReactNode {
    const color = LEVEL_COLORS[value as number] ?? "#878787";
    const label = LEVEL_LABELS[value as number] ?? "";

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
