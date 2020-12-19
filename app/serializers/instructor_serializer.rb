class InstructorSerializer < ActiveModel::Serializer
  attributes :id, :id_number, :full_name, :email, :available_hours

end
