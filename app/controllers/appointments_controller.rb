# frozen_string_literal: true

class AppointmentsController < ApplicationController
  def index; end

  private

  def safe_params
    params.require(:P)
  end
end
