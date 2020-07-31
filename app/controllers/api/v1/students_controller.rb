# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class StudentsController < ApiController
      def index
        @students = Student.all
        render json: @students
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
