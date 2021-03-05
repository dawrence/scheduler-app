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
      
    end
  end
end
