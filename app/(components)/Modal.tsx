"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { CgClose } from "react-icons/cg";

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
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-background shadow-2xl">
                <button
                    onClick={onDismiss}
                    className="btn-ghost absolute top-1 right-1 z-10 rounded-full pl-3! pr-2.5! py-2! cursor-pointer"
                >
                    <CgClose />
                </button>
                {children}
            </div>
        </div>
    );
}
