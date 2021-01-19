# frozen_string_literal: true

# :nodoc
module Repeatable
  extend ActiveSupport::Concern

  def without_appointments(start_time, end_time)
    start_date = start_time.utc
    end_date = end_time.utc
    ids = joins(:appointments)
          .where("appointments.start_at BETWEEN '#{start_date}' AND '#{end_date}' AND
                  appointments.end_at BETWEEN '#{start_date}' AND '#{end_date}'")
          .uniq
          .pluck(:id)
    where.not(id: ids)
  end
end
