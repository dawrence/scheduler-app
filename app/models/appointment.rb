class Appointment < ApplicationRecord
  belongs_to :instructor
  belongs_to :student
  belongs_to :vehicle
end
