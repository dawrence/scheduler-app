# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class InstructorsController < ApiController
      def index
        @instructors = Instructor.all
        render json: @instructors
      end

      def create
        instructor = Instructor.create!(safe_params)
        render json: instructor
      end

      def show

      end

      def update
        instructor = Instructor.find_by!(id: params[:id])
        instructor.update(safe_params)
        render json: instructor
      end

      def safe_params
        params.require(:instructor)
              .permit!(
                :full_name, :email,
                :phone, :available_hours,
                :id_number)
      end
    end
  end
end
