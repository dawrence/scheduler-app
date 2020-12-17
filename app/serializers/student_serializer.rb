class VehicleSerializer < ActiveModel::Serializer
  attributes :id_number, :full_name, :age, :email, :license_type, :available_hours

end
