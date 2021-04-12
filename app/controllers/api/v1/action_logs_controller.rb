module Api
  module V1
    #:nodoc:
    class ActionLogsController < ApiController
      
      def index
        if can_perform
          @action_logs = ActionLog.all.order(created_at: :desc)
          render json: @action_logs
        else
          render json: ActionLog.none
        end
      end

      def filter
        if can_perform
          @action_logs = ActionLog.all.order(created_at: :desc)
          @action_logs = @action_logs.where(user_id: params[:user]) if params[:user]
          @action_logs = @action_logs.where(student_id: params[:student]) if params[:student]
          render json: @action_logs
        else
          render json: ActionLog.none
        end
      end
      
      def filter_resources
        if can_perform
          render json: {
            students: Student.all.map{|student| {text: student.full_name, value: student.id}}, 
            users: User.all.map{|user| {text: user.email, value: user.id}}
          }
        else
          render json: {}
        end
      end

    end
  end
end
