# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class StudentsController < ApiController
      include Available

      def index
        if can_perform
          @students = Student.all.order(created_at: :desc)
          render json: @students
        else
          raise ApiErrors::Unauthorized
        end
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

      def destroy
        student = Student.find_by!(id: params[:id])
        student.destroy!
        render json: {}
      end

      def mark_as_debtor
        student = Student.find_by!(id: params[:id])
        student.mark_as_debtor
        render json: student
      end

      def unmark_as_debtor
        student = Student.find_by!(id: params[:id])
        student.unmark_as_debtor
        render json: student
      end

      def set_fine
        student = Student.find_by!(id: params[:id])
        student.set_fine
        render json: student
      end

      def pay_fine
        student = Student.find_by!(id: params[:id])
        student.pay_fine
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
