class Appointment < ApplicationRecord
  belongs_to :instructor
  belongs_to :student
  belongs_to :vehicle

  validate :validate_appointment_uniqueness
  validate :validate_assigned_hours

  def validate_appointment_uniqueness
    appointment_ids = Appointment.where(
      "(appointments.instructor_id = :instructor_id OR
       appointments.vehicle_id = :vehicle_id OR
       appointments.student_id = :student_id) AND
       (
         (date_trunc('minute', appointments.start_at) >= :start_date AND date_trunc('minute', appointments.start_at) < :end_date) OR
         (date_trunc('minute', appointments.end_at) > :start_date AND date_trunc('minute', appointments.end_at) < :end_date ) OR
         (:start_date > date_trunc('minute', appointments.start_at) AND :start_date < date_trunc('minute', appointments.end_at)) OR
         (:end_date > date_trunc('minute', appointments.start_at) AND :end_date < date_trunc('minute', appointments.end_at))
       )",
      {
        instructor_id: instructor_id,
        student_id: student_id,
        vehicle_id: vehicle_id,
        start_date: start_at.change(sec: 0),
        end_date: end_at.change(sec: 0)
      }).pluck(:id)
    appointment_ids.delete(id)

    return unless appointment_ids.count.positive?

    errors.add(:start_at, 'Cita ya existe')
    errors.add(:end_at, 'Cita ya existe')
  end

  def validate_assigned_hours
    hours = ((end_at - start_at) / 1.hour).round
    if instructor.assigned_hours + hours > instructor.available_hours
      errors.add(:instructor_id, "#{instructor.full_name} sobrepasa las horas disponibles")
    end

    if student.assigned_hours + hours > student.available_hours
      errors.add(:student_id, "#{student.full_name} sobrepasa las horas disponibles")
    end

    if vehicle.assigned_hours + hours > vehicle.available_hours
      errors.add(:vehicle_id, "#{vehicle.plate} sobrepasa las horas disponibles")
    end
  end
end
