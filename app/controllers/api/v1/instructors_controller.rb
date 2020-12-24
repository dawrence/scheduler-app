# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class InstructorsController < ApiController
      include Available

      def index
        @instructors = Instructor.all.order(created_at: :desc)
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
                      :license_type,
                      :id_number)
      end

      def model
        Instructor
      end
    end
  end
end
