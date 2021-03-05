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
        if roles.any?
          permission &&= roles.include?(current_user.role.to_sym)
        end
        permission
      end

      def raise_unless_authorized *roles
        unless can_perform(*roles)
          raise ApiErrors::Unauthorized
        end
      end

    end
  end
end
