module Available
  extend ActiveSupport::Concern

  def available
    render json: available_data
  end

  def available_data
    start_time = Time.iso8601(CGI.unescape(params[:start_at])).change(sec: 0)
    end_time = Time.iso8601(CGI.unescape(params[:end_at])).change(sec: 0)

    query = (vehicle.present? ? model_by_vehicle : model)
      .without_appointments(start_time, end_time)
      .order(created_at: :desc)

    model == Student ? query.limit(500) : query
  end

  def vehicle
    @vehicle ||= Vehicle.find_by(id: params[:vehicle_id])
  end

  def model_by_vehicle
    if vehicle.is_a?(Motorcycle)
      model.by_motorcycle
    else
      model.by_car
    end
  end

  def model; end
end
