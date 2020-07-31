# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class VehiclesController < ApiController
      def index
        # this needs to be paginated. or limited by date range...

        @vehicles = Vehicle.where(status: 'available')
        render json: @vehicles
      end

      def create

      end

      def show

      end

      def update
      end

      def safe_params
        params.require(:appointment).permit!(:instructor_id)
      end
    end
  end
end
