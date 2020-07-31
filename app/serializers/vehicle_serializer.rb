class VehicleSerializer < ActiveModel::Serializer
  attributes :plate, :id, :type, :available_hours

  def type
    object.type.downcase == 'car' ? 'Carro' : 'Moto'
  end
end
