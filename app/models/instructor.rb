class Instructor < ApplicationRecord
  has_many :appointments
  validates_uniqueness_of :id_number

  def self.without_appointments(start_time, end_time)
    start_date = start_time.utc
    end_date = end_time.utc
    instruc_with_app_ids = Instructor.joins(:appointments)
                                     .where("appointments.start_at BETWEEN '#{start_date}' AND '#{end_date}'")
                                     .uniq
                                     .pluck(:id)
    Instructor.where.not(id: instruc_with_app_ids)
  end

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
