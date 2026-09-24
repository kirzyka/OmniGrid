"use client";

import { useEffect, useState } from "react";

/**
 * Simple hook that returns `true` once the component has successfully mounted
 * in the browser. Helps avoid hydration mismatch errors (SSR vs CSR) when
 * consuming dynamic data.
 */
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}
