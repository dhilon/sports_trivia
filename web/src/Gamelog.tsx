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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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
                const label = current === "win" ? "W" : current === "loss" ? "L" : "Filter";
                return (
                    <div className="flex items-center gap-2">
                        <span>Status</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">{label}</Button>
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
                const label = current === "around_the_horn" ? "Around" : current === "rapid_fire" ? "Rapid" : current === "tower_of_power" ? "Tower" : "Filter";
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Game Type
                            <ArrowUpDown />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">{label}</Button>
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
                return <div className="capitalize flex items-center justify-center">{spaced}</div>;
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
                const label = current
                    ? current.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Filter";
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Sport
                            <ArrowUpDown />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">{label}</Button>
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
            cell: ({ row }) => <div className="capitalize">{row.getValue("sport")}</div>,
        },
        {
            accessorKey: "date",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <div className="text-right">Date</div>
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-right flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#ffffff73] text-[#101418] text-sm font-medium leading-normal w-full">{row.getValue("date")}</div>,
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
                            <DropdownMenuItem>Practice Questions</DropdownMenuItem>
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
    const name = params.name;

    const { data: games = [], error, isLoading } = useSWR<Game[]>(
        name ? "/users/" + name + "/games" : null
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
        <div className="flex justify-center">
            <div className="w-full max-w-[1300px] rounded-lg">
                <div className="border-2 border-gray-200 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-300 z-1">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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



            {modalGame && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold">
                            Opponents for Game #{modalGame.id}
                        </h2>
                        <ul className="mt-4 list-disc list-inside">
                            {modalGame.players.map((o) => {

                                return (
                                    <li key={o.username}>
                                        {o.username}
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
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
