class Appointment < ApplicationRecord
  belongs_to :instructor
  belongs_to :student
  belongs_to :vehicle

  validate :validate_appointment_uniqueness
  validate :validate_assigned_hours

  def validate_appointment_uniqueness
    appointments = Appointment.where(instructor_id: instructor_id,
                                     student_id: student_id,
                                     vehicle_id: vehicle_id,
                                     start_at: start_at..end_at,
                                     end_at: start_at..end_at)

    if appointments.count.positive?
      errors.add(:start_at, 'Cita ya existe')
      errors.add(:end_at, 'Cita ya existe')
    end
  end

  def validate_assigned_hours
    hours = (end_at - start_at).hours
    if instructor.assigned_hours + hours > instructor.available_hours
      errors.add(:instructor_id, 'Instructor sobrepasa las horas disponibles')
    end

    if student.assigned_hours + hours > student.available_hours
      errors.add(:student_id, 'Estudiante sobrepasa las horas disponibles')
    end

    if vehicle.assigned_hours + hours > vehicle.available_hours
      errors.add(:vehicle_id, 'Vehiculo sobrepasa las horas disponibles')
    end
  end
end
