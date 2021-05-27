module Api
  module V1
    #:nodoc:
    class CashFlowsController < ApiController

      def filter
        if can_perform
          student = Student.includes(:cash_flows).find_by(id: params[:student_id])
          render json: student, serializer: StudentCashFlowSerializer
        else
          render json: {cash_flows: []}
        end
      end

      def create
        raise_unless_authorized#(:admin, :treasurer)
        cash_flow = CashFlow.create!(safe_params)
        render json: cash_flow
      end

      def students
        if can_perform
          render json: Student.all.map{|student| {text: student.full_name.titleize, value: student.id}}
        else
          render json: {}
        end
      end

      private

        def safe_params
          params.require(:cash_flow).permit(:student_id, :concept, :amount, :kind)
        end
      
    end
  end
end
