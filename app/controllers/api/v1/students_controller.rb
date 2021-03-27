# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class StudentsController < ApiController
      include Available
      include Paginable

      def index
        if can_perform
          @students = Student.page(page).per(per_page).order(created_at: :desc)

          render json: @students
        else
          render json: Student.none
        end
      end

      def create
          raise_unless_authorized(:admin, :scheduler, :treasurer, :certifier)
          student = Student.create!(safe_params)
          render json: student
      end

      def update
        raise_unless_authorized(:admin, :scheduler, :treasurer, :certifier)
        student = Student.find_by!(id: params[:id])
        student.update!(safe_params)
        render json: student
      end

      def destroy
        raise_unless_authorized(:admin, :scheduler)
        student = Student.find_by!(id: params[:id])
        student.destroy!
        render json: {}
      end

      def mark_as_debtor
        raise_unless_authorized(:admin, :treasurer, :certifier)
        student = Student.find_by!(id: params[:id])
        student.mark_as_debtor
        current_user.action_logs.create(student: student, action: "marcó como moroso", content: params[:content])
        render json: student
      end

      def unmark_as_debtor
        raise_unless_authorized(:admin, :treasurer, :certifier)
        student = Student.find_by!(id: params[:id])
        student.unmark_as_debtor
        current_user.action_logs.create(student: student, action: "desmarcó como moroso", content: params[:content])
        render json: student
      end

      def set_fine
        raise_unless_authorized(:admin, :treasurer, :certifier)
        student = Student.find_by!(id: params[:id])
        student.set_fine
        current_user.action_logs.create(student: student, action: "impuso multa", content: params[:content])
        render json: student
      end

      def pay_fine
        raise_unless_authorized(:admin, :treasurer, :certifier)
        student = Student.find_by!(id: params[:id])
        student.pay_fine
        current_user.action_logs.create(student: student, action: "pagó multa", content: params[:content])
        render json: student
      end

      def change_status
        raise_unless_authorized(:admin, :scheduler, :certifier)
        student = Student.find_by!(id: params[:id])
        prev_status = student.status_text
        raise_unless_authorized(:admin, :certifier) if student.status == "active"
        student.next_status
        current_user.action_logs.create({
          student: student,
          action: "Cambió de #{prev_status} a #{student.status_text}",
          content: params[:content]
        }) if params[:content].present?
        render json: student
      end

      def status_count
        raise_unless_authorized(:admin, :scheduler, :certifier)
        render json: Student.status_count
      end

      def delete_appointments
        raise_unless_authorized(:admin, :scheduler)
        student = Student.find_by!(id: params[:id])
        student.appointments.delete_all
        render json: student
      end

      private

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
