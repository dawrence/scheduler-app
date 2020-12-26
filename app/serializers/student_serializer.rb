class StudentSerializer < ActiveModel::Serializer
  attributes :id, :id_number, :full_name, :age, :email, :license_type, :available_hours, :assigned_hours
end
