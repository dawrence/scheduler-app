# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class InstructorsController < ApiController
      include Available

      def index
        if can_perform(:admin, :treasurer, :certifier)
          @instructors = Instructor.all.order(created_at: :desc)

          render json: @instructors
        else
          render json: Instructor.none
        end
      end

      def create
        raise_unless_authorized(:admin, :treasurer, :certifier)
        instructor = Instructor.create!(safe_params)
        render json: instructor
      end

      def update
        raise_unless_authorized(:admin, :treasurer, :certifier)
        instructor = Instructor.find_by!(id: params[:id])
        instructor.update!(safe_params)
        render json: instructor
      end

      def destroy
        raise_unless_authorized(:admin, :treasurer, :certifier)
        instructor = Instructor.find_by!(id: params[:id])
        instructor.destroy!
        render json: {}
      end

      private

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
