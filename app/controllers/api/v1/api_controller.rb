module Api
  module V1
    #:nodoc:
    class ApiController < ::ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      skip_before_action :verify_authenticity_token

      def not_found
        render json: '{"error": "not_found"}', status: :not_found
      end
    end
  end
end
