class Student < ApplicationRecord
  has_many :appointments

  validates :license_type, inclusion: { in: %w[a2 b1 c1 a2b1 a2c1] }
  validates_uniqueness_of :id_number

  AVAILABLE_HOURS = {
    a2: 16,
    b1: 21,
    c1: 31,
    a2b1: 37,
    a2c1: 47
  }.freeze

  before_save :set_available_hours

  def self.without_appointments(start_time, end_time)
    start_date = start_time.utc
    end_date = end_time.utc
    student_with_app_ids = Student.joins(:appointments)
                                  .where("appointments.start_at BETWEEN '#{start_date}' AND '#{end_date}'")
                                  .uniq
                                  .pluck(:id)
    Student.where.not(id: student_with_app_ids)
  end

  def set_available_hours
    self.available_hours = AVAILABLE_HOURS[license_type.to_sym] || 0
  end

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
