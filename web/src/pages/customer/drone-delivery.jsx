import DroneDeliveryPage from './DroneDeliveryPage'

export default function DroneDelivery({
  order,
  restaurantLocation,
  customerLocation,
  onCompleted,
  onClose,
}) {
  return (
    <DroneDeliveryPage
      order={order}
      restaurantLocation={restaurantLocation}
      customerLocation={customerLocation}
      onCompleted={onCompleted}
      onClose={onClose}
    />
  )
}
