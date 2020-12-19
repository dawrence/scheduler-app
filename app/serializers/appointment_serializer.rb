class AppointmentSerializer < ActiveModel::Serializer
  attributes :id, :title, :startDate, :endDate, :instructor_id, :vehicle_id, :student_id

  belongs_to :instructor
  belongs_to :student
  belongs_to :vehicle

  def startDate
    object.start_at
  end

  def endDate
    object.end_at
  end
end
