module Api
  module V1
    #:nodoc:
    class ApiController < ::ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ApiErrors::Unauthorized, with: :unauthorized_request

      skip_before_action :verify_authenticity_token

      def not_found
        render json: '{"error": "not_found"}', status: :not_found
      end

      def unauthorized_request error
        render json: {error: error.message}, status: :unauthorized
      end


      private
      
      # can_perform => ALL(just login required) 
      # can_perform(:admin, ... roleX, ... roleY) => Specific Roles
      def can_perform *roles
        permission = user_signed_in?
        puts permission
        if roles.any?
          permission &&= roles.inject(false){|bool_value, role| bool_value || current_user.send("#{role}?")}
        end
        permission
      end

    end
  end
end
