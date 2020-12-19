class Vehicle < ApplicationRecord
  validates_uniqueness_of :plate
  has_many :appointments

  def self.without_appointments(start_time, end_time)
    start_date = start_time.utc
    end_date = end_time.utc
    vehicle_with_app_ids = Vehicle.joins(:appointments)
                                  .where("appointments.start_at BETWEEN '#{start_date}' AND '#{end_date}'")
                                  .uniq
                                  .pluck(:id)
    Vehicle.where(status: 'available').where.not(id: vehicle_with_app_ids)
  end

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
