class Student < ApplicationRecord
  has_many :appointments

  validate :license_type, inclusion: { in: %w[a2 b1 c1] }

  AVAILABLE_HOURS = {
    a2: 16,
    b1: 21,
    c1: 31
  }.freeze

  before_save :set_available_hours

  def set_available_hours
    self.available_hours = AVAILABLE_HOURS[license_type.to_sym] || 0
  end

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
