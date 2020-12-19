# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class StudentsController < ApiController
      def index
        @students = Student.all.order(created_at: :desc)
        render json: @students
      end

      def available
        start_time = Time.zone.strptime(CGI.unescape(params[:start_at]), '%d/%m/%Y %I:%M %p')
        end_time = Time.zone.strptime(CGI.unescape(params[:end_at]), '%d/%m/%Y %I:%M %p')
        @students = Student.without_appointments(start_time, end_time)
                              .order(created_at: :desc)
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
    end
  end
end
