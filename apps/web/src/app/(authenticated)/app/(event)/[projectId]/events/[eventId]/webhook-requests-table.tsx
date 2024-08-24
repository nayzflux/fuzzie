import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatDateTimeLong } from "~/lib/format";
import { PartialWebhookRequest, WebhookRequest } from "~/types/webhook-request";
import { HTTPCodeBadge } from "./http-code-badge";
import WebhookRequestStatusBadge from "./webhook-request-status-badge";

export const columns: ColumnDef<WebhookRequest>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <WebhookRequestStatusBadge status={row.original.status} />
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <Badge variant="outline">{row.original.id}</Badge>,
  },
  {
    accessorKey: "responseCode",
    header: "Response Code",
    cell: ({ row }) => (
      <div>
        {row.original.responseCode ? (
          <HTTPCodeBadge code={row.original.responseCode} />
        ) : (
          "---"
        )}
      </div>
    ),
  },
  {
    accessorKey: "sentAt",
    header: "Sent At",
    cell: ({ row }) => (
      <div>
        {row.original.sentAt ? formatDateTimeLong(row.original.sentAt) : "---"}
      </div>
    ),
  },
  {
    accessorKey: "scheduledFor",
    header: "Scheduled For",
    cell: ({ row }) => (
      <div>{formatDateTimeLong(row.original.scheduledFor)}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{formatDateTimeLong(row.original.createdAt)}</div>,
  },
];

export default function RequestsTable({
  events,
}: {
  events: PartialWebhookRequest[];
}) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
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
                );
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
