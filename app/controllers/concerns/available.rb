module Available
  extend ActiveSupport::Concern

  def available
    render json: available_data
  end

  def available_data
    start_time = Time.iso8601(CGI.unescape(params[:start_at])).change(sec: 0)
    end_time = Time.iso8601(CGI.unescape(params[:end_at])).change(sec: 0)

    model.without_appointments(start_time, end_time)
         .order(created_at: :desc)
  end

  def model; end
end
