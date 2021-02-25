# frozen_string_literal: true

class AppointmentsController < ApplicationController
  before_action :authenticate_user!

  def index; end

  private

  def safe_params
    params.require(:P)
  end
end
