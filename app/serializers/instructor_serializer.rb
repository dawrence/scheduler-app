class InstructorSerializer < ActiveModel::Serializer
  attributes :id, :id_number, :phone, :full_name, :email, :available_hours, :assigned_hours, :license_type

end
