module Api
  module V1
    class UsersController < ApiController

      def active_user
        if can_perform
          render json: current_user
        else
          raise ApiErrors::Unauthorized
        end
      end

    end
  end
end
