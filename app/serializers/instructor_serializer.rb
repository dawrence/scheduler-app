class InstructorSerializer < ActiveModel::Serializer
  attributes :id, :id_number, :phone,
             :full_name, :email,
             :available_hours, :license_type, :assigned_hours

  def assigned_hours
    object.appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
