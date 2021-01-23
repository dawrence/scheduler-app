# frozen_string_literal: true

# :nodoc
module Repeatable
  extend ActiveSupport::Concern

  def without_appointments(start_time, end_time)
    start_date = start_time.utc
    end_date = end_time.utc
    ids = joins(:appointments)
          .where("(:start_date > date_trunc('minute', appointments.start_at) AND :start_date < date_trunc('minute', appointments.end_at)) OR
                  (:end_date > date_trunc('minute', appointments.start_at) AND :end_date < date_trunc('minute', appointments.end_at))",
                  { start_date: start_date, end_date: end_date })
          .uniq
          .pluck(:id)
    where.not(id: ids)
  end
end
