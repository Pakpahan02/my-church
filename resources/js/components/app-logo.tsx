import { HkbpLogo } from '@/components/hkbp-logo';

export default function AppLogo() {
    return (
        <div className="flex w-full items-center gap-3">
            <HkbpLogo className="size-8 shrink-0 drop-shadow-xs" />
            <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-sm leading-tight font-bold text-[#1e3a8a]">
                    HKBP Citra Indah
                </span>
                <span className="truncate text-[11px] font-medium text-slate-400">
                    Ressort Jonggol
                </span>
            </div>
        </div>
    );
}
