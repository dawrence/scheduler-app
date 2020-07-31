# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class AppointmentsController < ApiController
      def index
        # this needs to be paginated. or limited by date range...
        start_at = Time.parse(params[:start_at])
        end_at = Time.parse(params[:end_at])

        @appointments = Appointment.where(start_at: start_at..end_at)
        render json: @appointments
      end

      # this can be refactored to avoid the queries on the instructors, students and vehicles.
      # Just delegate the validation to the model.
      def create

        instructor = Instructor.find_by(id: safe_params[:instructor_id])
        student = Student.find_by(id: safe_params[:student_id])
        vehicle = Vehicle.find_by(id: safe_params[:vehicle_id])
        start_at = Time.iso8601(safe_params[:startDate])
        end_at = Time.iso8601(safe_params[:endDate])

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

      def show
      end

      def update
      end

      private

      def instructor

      end

      def safe_params
        params.permit(:startDate, :endDate, :student_id, :vehicle_id, :instructor_id, :title)
      end
    end
  end
end
