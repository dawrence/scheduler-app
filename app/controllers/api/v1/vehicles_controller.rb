# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class VehiclesController < ApiController
      def index
        # this needs to be paginated. or limited by date range...

        @vehicles = Vehicle.all.order(created_at: :desc)
        render json: @vehicles
      end

      def available
        start_time = Time.zone.strptime(CGI.unescape(params[:start_at]), '%d/%m/%Y %I:%M %p')
        end_time = Time.zone.strptime(CGI.unescape(params[:end_at]), '%d/%m/%Y %I:%M %p')
        @vehicles = Vehicle.without_appointments(start_time, end_time)
                           .order(created_at: :desc)
        render json: @vehicles
      end

      def create
        # check why is this not working
        vehicle = Vehicle.create!(safe_params)

        render json: vehicle
      end

      def update
        vehicle = Vehicle.find_by(id: params[:id])
        vehicle.update!(safe_params)

        render json: vehicle
      end

      def safe_params
        params.require(:vehicle).permit(:type, :plate, :available_hours, :status)
      end
    end
  end
end
