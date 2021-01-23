# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class AppointmentsController < ApiController
      def index
        # this needs to be paginated. or limited by date range...
        start_at = Time.iso8601(CGI.unescape(params[:start_at]))
        end_at = Time.iso8601(CGI.unescape(params[:end_at]))
        filter_value = params[:filter_value]
        @appointments = if filter_type && filter_value
                          Appointment.where(start_at: start_at..end_at,
                                            filter_type => filter_value)
                        else
                          Appointment.where(start_at: start_at..end_at)
                        end

        render json: @appointments
      end

      # this can be refactored to avoid the queries on the instructors,
      # students and vehicles.
      # Just delegate the validation to the model.
      # bad one, and ugly
      def create
        appointment = Appointment.new(
          title: safe_params[:title],
          instructor_id: instructor&.id,
          vehicle_id: vehicle&.id,
          student_id: student&.id,
          start_at: iso_start_at,
          end_at: iso_end_at
        )

        if appointment.save
          render json: appointment
        else
          render json: { error: appointment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # so ugly, please just save safe_params.
      def update
        appointment = Appointment.find_by(id: params[:id])
        start_at = safe_params[:startDate] ? iso_start_at : appointment.start_at
        end_at = safe_params[:endDate] ? iso_end_at : appointment.end_at

        appointment.update(
          title: safe_params[:title] || appointment.title,
          instructor_id: instructor&.id || appointment.instructor_id,
          vehicle_id: vehicle&.id || appointment.vehicle_id,
          student_id: student&.id || appointment.student_id,
          start_at: start_at,
          end_at: end_at
        )

        if appointment.errors.present?
          render json: { error: appointment.errors.full_messages }, status: :unprocessable_entity
        else
          render json: appointment
        end
      end

      def destroy
        appointment = Appointment.find_by!(id: params[:id])
        appointment.destroy!
        render json: {}
      end

      private

      def iso_start_at
        Time.iso8601(CGI.unescape(safe_params[:startDate]))
      end

      def iso_end_at
        Time.iso8601(CGI.unescape(safe_params[:endDate]))
      end

      def instructor
        @instructor ||= Instructor.find_by(id: safe_params[:instructor_id])
      end

      def student
        @student ||= Student.find_by(id: safe_params[:student_id])
      end

      def vehicle
        @vehicle ||= Vehicle.find_by(id: safe_params[:vehicle_id])
      end

      def filter_type
        @filter_type ||= case params[:filter_type]
                         when 'vehicle'
                           :vehicle_id
                         when 'instructor'
                           :instructor_id
                         when 'student'
                           :student_id
                         end
      end

      def safe_params
        params.permit(:startDate, :endDate, :student_id,
                      :vehicle_id, :instructor_id, :title)
      end
    end
  end
end
