# frozen_string_literal: true

class StudentsController < ApplicationController
  before_action :authenticate_user!

  layout 'print'

  helper_method :current_date

  def index
    I18n.locale = :es
    # this needs to be paginated. or limited by date range...
    @start_at = Time.iso8601(CGI.unescape(params[:start_date])).beginning_of_day
    @end_at = Time.iso8601(CGI.unescape(params[:end_date])).end_of_day
    appointments = Appointment.where(start_at: @start_at..@end_at)
    student_ids = appointments.pluck(:student_id).uniq

    @students = Student.where(id: student_ids)
  end

  def show
    I18n.locale = :es
    @student = Student.find_by(id: params[:id])
    @appointments = @student.appointments
  end

  def current_date
    Time.zone.now.strftime('%A, %b %e')
  end
end
