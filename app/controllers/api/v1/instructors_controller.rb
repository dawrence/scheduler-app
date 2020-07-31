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
      end

      def show

      end

      def update
      end

      def safe_params
        params.require(:appointment).permit!(:instructor_id)
      end
    end
  end
end
