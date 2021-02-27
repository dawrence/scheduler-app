# frozen_string_literal: true

class StudentsController < ApplicationController
  before_action :authenticate_user!

  layout 'print'

  helper_method :current_date

  def show
    I18n.locale = :es
    @student = Student.find_by(id: params[:id])
    @appointments = @student.appointments
  end

  def current_date
    Time.zone.now.strftime('%A, %b %e')
  end
end
