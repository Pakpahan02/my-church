import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    label = 'Menu Utama',
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            {label && (
                <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    {label}
                </SidebarGroupLabel>
            )}
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isSubItemActive =
                        hasSubItems &&
                        item.items?.some((sub) => isCurrentUrl(sub.href));

                    if (hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <Collapsible
                                    defaultOpen={
                                        item.title === 'Master' ||
                                        item.isActive ||
                                        isSubItemActive
                                    }
                                    className="group/collapsible w-full"
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className="w-full cursor-pointer font-medium text-slate-700 transition-colors hover:bg-blue-50/80 hover:text-[#1e3a8a]"
                                        >
                                            {item.icon && (
                                                <item.icon className="h-4 w-4 text-slate-500 group-hover/collapsible:text-[#1e3a8a]" />
                                            )}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub className="my-0.5 ml-3.5 border-l border-blue-100 pl-2">
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl(
                                                            subItem.href,
                                                        )}
                                                        className="rounded-md text-xs font-normal text-slate-600 hover:bg-blue-50/60 hover:text-[#1e3a8a] data-[active=true]:bg-blue-50 data-[active=true]:font-semibold data-[active=true]:text-[#1e3a8a]"
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon className="mr-1 h-3.5 w-3.5 text-slate-400" />
                                                            )}
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href || '')}
                                tooltip={{ children: item.title }}
                                className="rounded-lg font-medium text-slate-700 transition-colors hover:bg-blue-50/80 hover:text-[#1e3a8a] data-[active=true]:bg-[#1e3a8a] data-[active=true]:text-white"
                            >
                                <Link href={item.href || '#'} prefetch>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
