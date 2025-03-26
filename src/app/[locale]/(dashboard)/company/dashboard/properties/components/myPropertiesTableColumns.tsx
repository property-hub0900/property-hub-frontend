/* eslint-disable no-unused-vars */
"use client"

import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { COMPANY_PATHS } from "@/constants/paths"
import { formatAmountToQAR, formatDateAndTime, getErrorMessage } from "@/lib/utils"
import { deletePropertyById, updatePropertyById } from "@/services/dashboard/properties"
import type { IProperty } from "@/types/dashboard/properties"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit2, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

// Create separate components for cells that need hooks
const FeaturedCell = ({ propertyId, featured }: { propertyId: string; featured: boolean }) => {
  const { handleUpgradeFeatured, isPending } = useFeatureProperty(propertyId)

  return (
    <div className="flex justify-center w-[80px]">
      {featured ? (
        <Image width={20} height={20} src="/star.svg" alt="PropertyHub" />
      ) : (
        <Button disabled={isPending} onClick={handleUpgradeFeatured} size={"sm"}>
          Upgrade
        </Button>
      )}
    </div>
  )
}

const ActionCell = ({ propertyId }: { propertyId: string }) => {
  const { onDelete, isPending } = useDeleteProperty(propertyId)

  return (
    <>
      <Loader isLoading={isPending}></Loader>
      <div className="flex gap-3 items-center">
        <Link href={`${COMPANY_PATHS.properties}/${propertyId}`}>
          <Edit2 className="size-5 text-primary" />
        </Link>
        <Trash2 onClick={() => onDelete(propertyId)} className="size-5 text-destructive cursor-pointer" />
      </div>
    </>
  )
}

// Custom hooks for the cell components
import { useMutation, useQueryClient } from "@tanstack/react-query"

function useFeatureProperty(propertyId: string) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  })

  const handleUpgradeFeatured = async () => {
    try {
      const updatedObj = {
        id: String(propertyId),
        payload: { featured: true },
      }

      const response = await mutateAsync(updatedObj)
      toast.success(response.message)
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return { handleUpgradeFeatured, isPending }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useDeleteProperty(propertyId: string) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["deletePropertyById"],
    mutationFn: deletePropertyById,
  })

  const onDelete = async (id: string) => {
    try {
      const response = await mutateAsync(id as any)
      toast.success(response.message)
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return { onDelete, isPending }
}

export const myPropertiesTableColumns: ColumnDef<IProperty>[] = [
  {
    accessorKey: "referenceNo",
    header: "Ref ID",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original
      const { propertyId } = rowData
      return (
        <Link className="text-primary" href={`${COMPANY_PATHS.properties}/${propertyId}`}>
          {rowData.referenceNo}
        </Link>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => {
      const { price } = row.original
      return <>{formatAmountToQAR(price)}</>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original
      const { createdAt } = rowData
      return <div className="capitalize">{formatDateAndTime(createdAt)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original
      const { status } = rowData
      return <div className="capitalize">{status}</div>
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original
      const { propertyId, featured } = rowData
      return <FeaturedCell propertyId={propertyId as any} featured={featured} />
    },
  },
  {
    accessorKey: "propertyId",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original
      const { propertyId } = rowData
      return <ActionCell propertyId={propertyId as any} />
    },
  },
]

