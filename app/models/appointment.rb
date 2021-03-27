class Appointment < ApplicationRecord
  CLASS_PRACTICE_TYPE = 'practice'.freeze
  CLASS_TEST_TYPE = 'test'.freeze
  CLASS_TYPES = [CLASS_PRACTICE_TYPE, CLASS_TEST_TYPE].freeze

  belongs_to :instructor
  belongs_to :student
  belongs_to :vehicle

  before_save :set_title

  validates :license_type, inclusion: { in: [Student::LICENSE_A2, Student::LICENSE_B1, Student::LICENSE_C1] }
  validates :class_type, inclusion: { in: CLASS_TYPES }

  validate :validate_appointment_uniqueness
  validate :validate_student_license_type
  validate :validate_instructor_license_type
  validate :instructor_assigned_hours
  validate :student_assigned_hours
  # validate :student_is_good_standing TODO: will be added next.

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

  def hours
    ((end_at - start_at) / 1.hour).round
  end

  def validate_student_license_type
    return if student.license_type.include?(license_type)

    errors.add(:student_id, "La Licencia del estudiante no es la de la clase")
  end

  def validate_instructor_license_type
    return if instructor.license_type.include?(license_type)

    errors.add(:instructor_id, "El instructor no es el adecuado para esta clase")
  end

  def instructor_assigned_hours
    if instructor.assigned_hours_per_day(start_at) + hours > Instructor::MAX_HOURS_PER_DAY
      errors.add(
        :instructor_id,
        "#{instructor.full_name} sobrepasa el maximo de horas diarias"
      )
    end

    if instructor.assigned_hours_per_month(start_at) + hours > Instructor::MAX_HOURS_PER_MONTH
      errors.add(
        :instructor_id,
        "#{instructor.full_name} sobrepasa el maximo de horas mensuales"
      )
    end
  end

  def student_assigned_hours
    student_hours = student.assigned_hours_per_license(license_type)

    if student_hours + hours > student.available_hours_per_license(license_type)
      errors.add(:student_id, "#{student.full_name} sobrepasa las horas disponibles en la licencia #{license_type}")
    end
  end

  def student_is_good_standing
    if self.student.is_debtor_or_has_fines?
      errors.add(:student_id, "#{student.full_name} no se encuentra a paz y salvo.")
    end
  end

  def class_type_name
    case class_type
    when CLASS_PRACTICE_TYPE
      'Práctica'
    when CLASS_TEST_TYPE
      'Validación'
    end
  end

  def license_type_name
    case license_type
    when Student::LICENSE_A2
      'Moto'
    when Student::LICENSE_B1
      'Carro'
    when Student::LICENSE_C1
      'Vehiculo Particular'
    end
  end

  def display_date
    # TODO: Tech debt. The timezone should be Colombia for all

    start_at.localtime('-05:00').strftime('%A, %b %e')
  end

  def display_hour
    # TODO: Tech debt. The timezone should be Colombia for all

    "#{start_at.localtime('-05:00').strftime('%I:%M %P')} - #{end_at.localtime('-05:00').strftime('%I:%M %P')}"
  end

  def set_title
    self.title = "#{class_type_name} -
     #{license_type_name} - #{student.full_name}"
  end

  def self.debtor_student_starts_in_few_days?
    today = Time.zone.now.beginning_of_day
    joins(:student).where(start_at: (today..(today + 3.days)), students: {debtor: true}).size.positive?
  end
end
