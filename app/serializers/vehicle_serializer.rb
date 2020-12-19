class VehicleSerializer < ActiveModel::Serializer
  attributes :plate, :id, :type, :string_type, :available_hours, :status

  def string_type
    object.type.downcase == 'car' ? 'Carro' : 'Moto'
  end
end
