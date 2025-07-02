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
    onViewOpponents: (game: Game) => void
): ColumnDef<Game, any>[] {
    return [
        {
            id: "select",
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: "Status",
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
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Game Type
                        <ArrowUpDown />
                    </Button>
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
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sport
                        <ArrowUpDown />
                    </Button>
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
            cell: ({ row }) => {

                return <div className="text-right flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#ffffff73] text-[#101418] text-sm font-medium leading-normal w-full">{row.getValue("date")}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
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
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigate("/games/" + sport + "/" + lgameType + "/" + gameId)}
                            >
                                Review Game
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewOpponents(game)}>View opponents</DropdownMenuItem>
                            <DropdownMenuItem>Practice</DropdownMenuItem>
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

    const { data: games = [], error, isLoading } = useSWR<Game[]>("/users/" + params.name + "/games");

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

    const columns = getColumns((game) => handleOpps(game));



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

    if (error) return <Redirect to="/" />;
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
