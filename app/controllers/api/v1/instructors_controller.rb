# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class InstructorsController < ApiController
      def index
        @instructors = Instructor.all.order(created_at: :desc)
        render json: @instructors
      end

      def available
        start_time = Time.zone.strptime(CGI.unescape(params[:start_at]), '%d/%m/%Y %I:%M %p')
        end_time = Time.zone.strptime(CGI.unescape(params[:end_at]), '%d/%m/%Y %I:%M %p')
        @instructors = Instructor.without_appointments(start_time, end_time)
                              .order(created_at: :desc)
        render json: @instructors
      end

      def create
        instructor = Instructor.create!(safe_params)
        render json: instructor
      end

      def update
        instructor = Instructor.find_by!(id: params[:id])
        instructor.update!(safe_params)
        render json: instructor
      end

      def safe_params
        params.require(:instructor)
              .permit(:full_name, :email,
                      :phone, :available_hours,
                      :id_number)
      end
    end
  end
end
