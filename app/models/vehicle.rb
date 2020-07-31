class Vehicle < ApplicationRecord
  validates_uniqueness_of :plate
end
