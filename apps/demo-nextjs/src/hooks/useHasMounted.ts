"use client";

import { useEffect, useState } from "react";

/**
 * Простой хук, возвращающий true, если компонент успешно примонтирован в браузере.
 * Помогает избежать ошибок гидратации (SSR vs CSR mismatch) для динамических данных.
 */
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}
