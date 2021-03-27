# frozen_string_literal: true

# :nodoc
class Student < ApplicationRecord
  LICENSE_A2 = 'a2'.freeze
  LICENSE_B1 = 'b1'.freeze
  LICENSE_C1 = 'c1'.freeze
  FINE_VALUE = 15000.0.freeze
  STATUS_ES = %w[Inscrito Activo Certificado].freeze
  extend Repeatable

  has_many :appointments, dependent: :destroy
  has_many :fines
  has_many :action_logs

  validates :license_type, inclusion: { in: %w[a2 b1 c1 a2b1 a2c1] }
  validates_uniqueness_of :id_number

  scope :by_car, -> { where("students.license_type ILIKE '%#{Student::LICENSE_B1}%' OR students.license_type ILIKE '%#{Student::LICENSE_C1}%'") }

  scope :by_motorcycle, -> { where("students.license_type ILIKE '%#{Student::LICENSE_A2}%'") }

  AVAILABLE_HOURS = {
    a2: 16,
    b1: 21,
    c1: 31,
    a2b1: 37,
    a2c1: 47
  }.freeze

  before_save :set_available_hours
  enum status: %i[inscribed active certified]


  def set_available_hours
    self.available_hours = AVAILABLE_HOURS[license_type.to_sym] || 0
  end

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end

  def assigned_hours_per_license(license_type)
    appointments.where(license_type: license_type).sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end

  def available_hours_per_license(license_type)
    AVAILABLE_HOURS[license_type.to_sym]
  end

  def is_debtor_or_has_fines
    self.total_fines > 0 || self.debtor?
  end
  alias :is_debtor_or_has_fines? :is_debtor_or_has_fines

  def total_fines
    self.fines.current.count
  end

  def total_fines_value
    self.fines.current.sum(&:value)
  end

  def set_fine
    self.fines.create!(value: FINE_VALUE)
  end

  def pay_fine
    self.fines.current.order(created_at: :asc).first.pay
  end

  def mark_as_debtor
    self.update!(debtor: true)
  end

  def unmark_as_debtor
    self.update!(debtor: false)
  end

  def status_text
    STATUS_ES[Student.statuses[self.status]] || self.status
  end

  def next_status
    case self.status
    when "inscribed"
      self.active!
    when "active"
      self.certified!
    end
  end

  def self.status_count
    self.statuses.map do |(status, status_value)|
      {
        status: STATUS_ES[status_value],
        count: self.send(status).count
      }
    end
  end

end
