# frozen_string_literal: true

# :nodoc
class Instructor < ApplicationRecord
  extend Repeatable

  include Assignable

  has_many :appointments
  validates_uniqueness_of :id_number
end
