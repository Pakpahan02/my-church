import { HkbpLogo } from '@/components/hkbp-logo';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 w-full">
            <HkbpLogo className="size-8 shrink-0 drop-shadow-xs" />
            <div className="flex flex-col text-left overflow-hidden">
                <span className="truncate leading-tight font-bold text-sm text-[#1e3a8a]">
                    HKBP Citra Indah
                </span>
                <span className="truncate text-[11px] font-medium text-slate-400">
                    Ressort Jonggol
                </span>
            </div>
        </div>
    );
}
