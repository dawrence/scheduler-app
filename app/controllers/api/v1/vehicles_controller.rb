# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class VehiclesController < ApiController
      include Available

      def index
        # this needs to be paginated. or limited by date range...
        if can_perform#(:admin, :treasurer)
          @vehicles = Vehicle.all.order(created_at: :desc)
          render json: @vehicles
        else
          render json: Vehicle.none
        end
      end

      def create
        # check why is this not working
        raise_unless_authorized#(:admin, :treasurer)
        vehicle = Vehicle.create!(safe_params)

        render json: vehicle
      end

      def update
        raise_unless_authorized#(:admin, :treasurer)
        vehicle = Vehicle.find_by!(id: params[:id])
        vehicle.update!(safe_params)

        render json: vehicle
      end

      def destroy
        raise_unless_authorized#(:admin, :treasurer)
        vehicle = Vehicle.find_by!(id: params[:id])
        vehicle.destroy!

        render json: {}
      end

      private

        def safe_params
          params.require(:vehicle).permit(:type, :plate, :available_hours, :status)
        end

        def model
          Vehicle
        end
    end
  end
end
