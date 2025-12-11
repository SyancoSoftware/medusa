import { ExclamationCircleSolid } from "@medusajs/icons"
import { Button, Container, Divider, Heading, Text, toast } from "@medusajs/ui"
import { useLocation } from "react-router-dom"
import { useDraftOrderCancelEdit } from "../../hooks/api/draft-orders"
import { useOrderPreview } from "../../hooks/api/orders"

const DETAILS_PAGE_REGEX = /\/draft-orders\/[a-zA-Z0-9_-]+\/?$/
interface ActiveOrderChangeProps {
  orderId: string
}

export const ActiveOrderChange = ({ orderId }: ActiveOrderChangeProps) => {
  const { order: preview } = useOrderPreview(orderId)
  const location = useLocation()

  const isPending = preview?.order_change?.status === "pending"
  const isDetailsPage = DETAILS_PAGE_REGEX.test(location.pathname)

  const { mutateAsync, isPending: isMutating } =
    useDraftOrderCancelEdit(orderId)

  if (!isPending || !isDetailsPage) {
    return null
  }

  const onCancel = async () => {
    await mutateAsync(undefined, {
      onError: (e) => {
        toast.error(e.message)
      },
      onSuccess: () => {
        toast.success("Edición cancelada")
      },
    })
  }

  const actions = preview.order_change.actions
  const noActions = !actions || actions.length === 0

  return (
    <div
      className="border-b border-x px-3 py-3 -mx-4 -mt-3"
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
      }}
    >
      <Container className="p-0 overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-x-2">
          <ExclamationCircleSolid className="text-ui-fg-interactive" />
          <Heading>Edición pendiente</Heading>
        </div>
        <Divider variant="dashed" />
        <div className="px-6 py-4">
          <Text className="text-pretty">
            {noActions
              ? "Hay una edición pendiente en este borrador de pedido sin cambios. Haga clic abajo para cancelarla o abra uno de los menús para comenzar a realizar cambios."
              : "Hay una edición pendiente en este borrador de pedido con cambios. Haga clic abajo para cancelarla o para continuar y completar la edición."}
          </Text>
        </div>
        <Divider variant="dashed" />
        <div className="bg-ui-bg-component px-6 py-4 justify-end items-center flex gap-x-2">
          {!noActions && (
            <Button
              size="small"
              variant="secondary"
              isLoading={isMutating}
              onClick={onCancel}
            >
              Continuar
            </Button>
          )}
          <Button
            size="small"
            variant="secondary"
            isLoading={isMutating}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </Container>
    </div>
  )
}
