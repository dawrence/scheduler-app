# frozen_string_literal: true

# :nodoc
class Student < ApplicationRecord
  extend Repeatable

  include Assignable

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

  def set_available_hours
    self.available_hours = AVAILABLE_HOURS[license_type.to_sym] || 0
  end
end
