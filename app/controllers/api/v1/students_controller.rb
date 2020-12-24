# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class StudentsController < ApiController
      include Available

      def index
        @students = Student.all.order(created_at: :desc)
        render json: @students
      end

      def create
        student = Student.create!(safe_params)
        render json: student
      end

      def update
        student = Student.find_by!(id: params[:id])
        student.update!(safe_params)
        render json: student
      end

      def safe_params
        params.require(:student)
              .permit(:full_name, :email, :phone,
                      :license_type, :age, :id_number)
      end

      def model
        Student
      end
    end
  end
end
