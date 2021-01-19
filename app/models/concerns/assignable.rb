# frozen_string_literal: true

# :nodoc
module Assignable
  extend ActiveSupport::Concern

  def assigned_hours
    appointments.sum do |a|
      ((a.end_at - a.start_at) / 1.hour).round
    end
  end
end
