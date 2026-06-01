"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/15 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === overlayRef.current) onDismiss();
            }}
        >
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-background shadow-2xl">
                <button
                    onClick={onDismiss}
                    className="btn-outline absolute top-4 right-4 z-10 rounded-full px-3! py-2!"
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
}
