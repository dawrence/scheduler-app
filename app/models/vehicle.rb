# frozen_string_literal: true

# :nodoc
class Vehicle < ApplicationRecord
  extend Repeatable
  include Assignable

  validates_uniqueness_of :plate
  has_many :appointments
end
