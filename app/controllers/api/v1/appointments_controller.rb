# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class AppointmentsController < ApiController
      def index
        # this needs to be paginated. or limited by date range...
        start_at = Time.parse(params[:start_at])
        end_at = Time.parse(params[:end_at])
        filter_type = case params[:filter_type]
                      when 'vehicle'
                        :vehicle_id
                      when 'instructor'
                        :instructor_id
                      when 'student'
                        :student_id
                      end
        filter_value = params[:filter_value]

        @appointments = Appointment.all

        if filter_type && filter_value
          @appointments = @appointments.where(filter_type => filter_value)
        end

        render json: @appointments
      end

      # this can be refactored to avoid the queries on the instructors, students and vehicles.
      # Just delegate the validation to the model.
      # bad one, and ugly
      def create

        instructor = Instructor.find_by(id: safe_params[:instructor_id])
        student = Student.find_by(id: safe_params[:student_id])
        vehicle = Vehicle.find_by(id: safe_params[:vehicle_id])
        start_at = Time.iso8601(CGI.unescape(safe_params[:startDate]))
        end_at = Time.iso8601(CGI.unescape(safe_params[:endDate]))

        appointment = Appointment.create!(
          title: safe_params[:title],
          instructor_id: instructor&.id,
          vehicle_id: vehicle&.id,
          student_id: student&.id,
          start_at: start_at,
          end_at: end_at
        )

        render json: appointment
      end


      # so ugly, please just save safe_params.
      def update
        appointment = Appointment.find_by(id: params[:id])

        instructor = Instructor.find_by(id: safe_params[:instructor_id])
        student = Student.find_by(id: safe_params[:student_id])
        vehicle = Vehicle.find_by(id: safe_params[:vehicle_id])
        start_at = safe_params[:startDate] ? Time.iso8601(CGI.unescape(safe_params[:startDate])) : appointment.start_at
        end_at = safe_params[:endDate] ? Time.iso8601(CGI.unescape(safe_params[:endDate])) : appointment.end_at

        appointment.update!(
          title: safe_params[:title] || appointment.title,
          instructor_id: instructor&.id || appointment.instructor_id,
          vehicle_id: vehicle&.id || appointment.vehicle_id,
          student_id: student&.id || appointment.student_id,
          start_at: start_at,
          end_at: end_at
        )

        render json: appointment
      end

      private

      def safe_params
        params.permit(:startDate, :endDate, :student_id,
                      :vehicle_id, :instructor_id, :title)
      end
    end
  end
end
