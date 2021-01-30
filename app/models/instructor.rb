# frozen_string_literal: true

# :nodoc
class Instructor < ApplicationRecord
  extend Repeatable

  MAX_HOURS_PER_DAY = 10.freeze
  MAX_HOURS_PER_MONTH = 240.freeze

  has_many :appointments
  validates_uniqueness_of :id_number

  def assigned_hours_per_day(date)
    assigned_hours(date.beginning_of_day, date.end_of_day)
  end

  def assigned_hours_per_month(date)
    assigned_hours(date.beginning_of_month, date.end_of_month)
  end

  private

  def assigned_hours(from, to)
    appointments.where(start_at: from..to).sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
