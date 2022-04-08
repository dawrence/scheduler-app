class AppointmentSerializer < ActiveModel::Serializer
  attributes :id, :title, :startDate, :endDate,
             :instructor_id, :vehicle_id,
             :student_id, :license_type, :class_type

  belongs_to :instructor
  belongs_to :student, serializer: StudentRawSerializer
  belongs_to :vehicle

  def startDate
    object.start_at
  end

  def endDate
    object.end_at
  end
end
