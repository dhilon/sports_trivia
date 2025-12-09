"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SidebarLayout } from "./SidebarLayout"
import { navigate } from "wouter/use-browser-location"
import { Redirect, useParams } from "wouter"
import useSWR from "swr"
import { Game } from "./types"
import { formatRelativeDate } from "./lib/dateUtils"


export function getColumns(
    games: Game[],
    onViewOpponents: (game: Game) => void
): ColumnDef<Game, any>[] {
    const wins = games?.filter((g) => g.status === "win").length ?? 0;
    const losses = games?.filter((g) => g.status === "loss").length ?? 0;
    return [
        {
            id: "select",
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                const current = (column.getFilterValue() as string) || "";
                return (
                    <div className="flex items-center gap-2">
                        <span>Status</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {current === "win" ? "W" : current === "loss" ? "L" : <Filter className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" sideOffset={6}>
                                <DropdownMenuItem
                                    className={`${current === "" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "win" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("win")}
                                >
                                    W ({wins})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "loss" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("loss")}
                                >
                                    L ({losses})
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => {
                // force‐cast to string
                const str = row.getValue("status") as string;
                // replace all underscores with spaces
                const spaced = str.replace(/_/g, " ");
                return <div className="capitalize ">{spaced}</div>;
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                const current = (column.getFilterValue() as string) || "";
                const ath = games?.filter((g) => g.type === "around_the_horn").length ?? 0;
                const rf = games?.filter((g) => g.type === "rapid_fire").length ?? 0;
                const top = games?.filter((g) => g.type === "tower_of_power").length ?? 0;
                return (
                    <div className="flex items-center justify-start gap-2 pl-4">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Game Type
                            <ArrowUpDown />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {current === "around_the_horn" ? "Around" : current === "rapid_fire" ? "Rapid" : current === "tower_of_power" ? "Tower" : <Filter className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" sideOffset={6}>
                                <DropdownMenuItem
                                    className={`${current === "" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "around_the_horn" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("around_the_horn")}
                                >
                                    Around ({ath})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "rapid_fire" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("rapid_fire")}
                                >
                                    Rapid ({rf})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "tower_of_power" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("tower_of_power")}
                                >
                                    Tower ({top})
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            cell: ({ row }) => {
                // force‐cast to string
                const str = row.getValue("type") as string;
                // replace all underscores with spaces
                const spaced = str.replace(/_/g, " ");
                return <div className="capitalize flex items-center justify-start pl-4">{spaced}</div>;
            },
        },
        {
            accessorKey: "sport",
            header: ({ column }) => {
                const current = (column.getFilterValue() as string) || "";
                const basketball = games?.filter((g) => g.sport === "basketball").length ?? 0;
                const soccer = games?.filter((g) => g.sport === "soccer").length ?? 0;
                const baseball = games?.filter((g) => g.sport === "baseball").length ?? 0;
                const football = games?.filter((g) => g.sport === "football").length ?? 0;
                const tennis = games?.filter((g) => g.sport === "tennis").length ?? 0;
                const hockey = games?.filter((g) => g.sport === "hockey").length ?? 0;
                return (
                    <div className="flex items-center justify-start gap-2 pl-4">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Sport
                            <ArrowUpDown />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {current ? current.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : <Filter className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" sideOffset={6}>
                                <DropdownMenuItem
                                    className={`${current === "" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "basketball" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("basketball")}
                                >
                                    Bball ({basketball})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "soccer" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("soccer")}
                                >
                                    Soccer ({soccer})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "baseball" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("baseball")}
                                >
                                    Baseball ({baseball})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "football" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("football")}
                                >
                                    Football ({football})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "tennis" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("tennis")}
                                >
                                    Tennis ({tennis})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={`${current === "hockey" ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : ""}`}
                                    onClick={() => column.setFilterValue("hockey")}
                                >
                                    Hockey ({hockey})
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            cell: ({ row }) => <div className="capitalize flex items-center justify-start pl-4">{row.getValue("sport")}</div>,
        },
        {
            accessorKey: "date",
            header: ({ column }) => {
                return (
                    <div className="flex items-center justify-start pl-8">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Date
                            <ArrowUpDown />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="flex cursor-pointer items-center justify-start pl-8 overflow-hidden rounded-full h-8 px-4 bg-[#ffffff73] text-[#101418] text-sm font-medium leading-normal w-full">{formatRelativeDate(row.getValue("date"))}</div>,
            sortingFn: (rowA, rowB, columnId) => {
                const dateA = new Date(rowA.getValue(columnId));
                const dateB = new Date(rowB.getValue(columnId));
                return dateA.getTime() - dateB.getTime();
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: "Total games: " + (games?.length ?? 0),
            cell: ({ row }) => {
                const game = row.original
                const gameType = row.getValue("type");
                const sgameType = typeof gameType === 'string' ? gameType.replace(/\s+/g, '_') : '';
                const lgameType = typeof sgameType === 'string' ? sgameType.toLowerCase() : '';
                const sport = row.getValue("sport");
                const gameId = (row.original as Game).id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" sideOffset={6}>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigate("/games/" + sport + "/" + lgameType + "/" + gameId)}
                            >
                                Review Game
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate("/games/" + sport + "/" + lgameType + "/" + gameId + "/results")}
                            >
                                View Results
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewOpponents(game)}>View opponents</DropdownMenuItem>
                            <DropdownMenuLabel className="italic font-light text-green-400">{game.time} seconds</DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}

function Gamelog() {

    const params = useParams();
    const id = params.id;

    const { data: games = [], error, isLoading } = useSWR<Game[]>(
        id ? "/users/" + id + "/games" : null
    );

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [modalGame, setModalGame] = React.useState<Game | null>(null);

    const handleOpps = (game: Game) => {
        // game contains all row data
        setModalGame(game);
        // do anything: navigate, open a modal, etc.
    };

    const columns = getColumns(games, (game) => handleOpps(game));



    const table = useReactTable({
        data: games,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    if (error) {
        // If session expired, send to login; otherwise show inline error
        const status = (error as any)?.response?.status;
        if (status === 401) return <Redirect to="/login" />;
        return <div className="p-4 text-red-600">Failed to load gamelog.</div>
    }
    if (isLoading) return <div>loading...</div>

    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="sticky top-0 z-2 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center px-4 sm:px-6">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900">Game Log</h1>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-8">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        <Table>
                            <TableHeader className="sticky top-0 bg-gray-100/90 backdrop-blur z-2 border-b border-gray-200">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="text-gray-800 font-semibold">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>



            {modalGame && (
                <div className="fixed inset-0 z-2 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md">
                        <h2 className="text-xl font-bold text-gray-900">
                            Opponents for Game #{modalGame.id}
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {modalGame.players.map((o) => {
                                return (
                                    <li key={o.username} className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700">
                                        <a href={"/profile/" + o.id}>{o.username}</a>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            className="mt-6 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            onClick={() => setModalGame(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default function GamelogPage() {
    return (
        <SidebarLayout>
            <Gamelog />
        </SidebarLayout>
    )
}
